import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import {
  catchError,
  EMPTY,
  from,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import moment from 'moment';
import { SyncFinancialIndicatorYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorYear.consumer';
import { SyncFinancialIndicatorQuarterConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorQuarter.consumer';
import { Injectable } from '@nestjs/common';
import { LogService } from '@module/core/service/log.service';
import { Effect } from '@module/core/decorator/store-effect';
import { getFinanceInfoStatus } from '@module/finan-info/store/financial-info/fns/getFinanceInfoStatus';
import { FinancialTermTypeEnum } from '@module/finan-info/entity/financial-info-status.entity';
import {
  requestFinancialInfoAction,
  requestFinancialInfoAfterAction,
  requestFinancialInfoErrorAction,
  saveFinanceInfoPageAfterAction,
  saveFinanceInfoPageErrorAction,
  startGetFinanceInfoAction,
} from '@module/finan-info/store/financial-info/financial-info.actions';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';
import { FinancialInfo } from '@module/finan-info/store/financial-info/financial-info.reducer';
import { filter } from 'rxjs/operators';
import { getFinancialInfoPage } from '@module/finan-info/store/financial-info/fns/getFinancialInfoPage';
import { saveFinanceInfo } from '@module/finan-info/store/financial-info/fns/saveFinaceInfo';
import { Levels } from '@module/core/schemas/log-db.schema';

@Injectable()
export class FinancialInfoEffects {
  constructor(private log: LogService) {}

  @Effect()
  whenStartSync$ = createEffect((action$) => {
    return action$.pipe(
      ofType(startGetFinanceInfoAction),
      switchMap((action) => {
        const code = action.payload.code;
        const termType = action.payload.termType;
        const type = action.payload.type;
        return from(getFinanceInfoStatus(code, termType, type)).pipe(
          map((syncStatus) => {
            this.log.log({
              source: 'fi',
              group: 'sync_info',
              group1: code,
              group2: type,
              group3: termType,
              message: `______________ [${action.payload.code}|${type}|${termType}] Start get data ______________`,
            });
            if (syncStatus) {
              this.log.log({
                source: 'fi',
                group: 'sync_info',
                group1: code,
                group2: type,
                group3: termType,
                message: `[${
                  action.payload.code
                }|${type}|${termType}] Có dữ liệu quá khứ ${JSON.stringify(
                  syncStatus,
                  undefined,
                  2,
                )}`,
              });
              if (parseInt(syncStatus.year) < moment().year() - 1) {
                /*
                 * Trường hợp này là đã chạy trước đó nhung bị dừng đột ngột
                 * Do không biết với năm hiện tại thì đang ở page nào nên bắt buốc phải request lại từ đầu
                 * Truyền vào lastYear nhằm mục đích là CÓ THỂ dùng để filter chỉ update những thằng sau lastYear thôi
                 * */

                this.log.log({
                  source: 'fi',
                  group: 'sync_info',
                  group1: code,
                  group2: type,
                  group3: termType,
                  message: `[${action.payload.code}|${type}|${termType}] Lấy lại tự đầu do bị break`,
                });

                return requestFinancialInfoAction({
                  termType,
                  type,
                  code,
                  page:
                    termType === FinancialTermTypeEnum.YEAR
                      ? FinancialInfoValues.START_PAGE_FOR_YEAR
                      : FinancialInfoValues.START_PAGE_FOR_QUARTER,
                  lastYear: parseInt(syncStatus.year),
                });
              } else {
                // Vẫn lấy page đầu tiên trong trường hợp có update (Chưa kiểm toán, kiểm toán)
                this.log.log({
                  source: 'fi',
                  group: 'sync_info',
                  group1: code,
                  group2: type,
                  group3: termType,
                  message: `[${action.payload.code}|${type}|${termType}] Update dữ liệu năm liền kề`,
                });
                return requestFinancialInfoAction({
                  termType,
                  type,
                  code,
                  page: 1,
                  lastYear: moment().year() - 1,
                });
              }
            } else {
              this.log.log({
                source: 'fi',
                group: 'sync_info',
                group1: code,
                group2: type,
                group3: termType,
                message: `[${action.payload.code}|${type}|${termType}] Lấy dữ liệu từ đầu`,
              });
              // Chưa request bao giờ
              return requestFinancialInfoAction({
                termType,
                type,
                code,
                page:
                  termType === FinancialTermTypeEnum.YEAR
                    ? FinancialInfoValues.START_PAGE_FOR_YEAR
                    : FinancialInfoValues.START_PAGE_FOR_QUARTER,
              });
            }
          }),
        );
      }),
    );
  });

  @Effect()
  requestFinancialInfoPage$ = createEffect((action$, state$) => {
    return action$.pipe(
      ofType(requestFinancialInfoAction),
      withLatestFrom(state$, (v1, v2) => {
        const action: any = v1;
        const infoState: FinancialInfo = v2.infos.find(
          (_if) =>
            _if.code === action.payload.code &&
            _if.termType === action.payload.termType &&
            _if.type === action.payload.type,
        );

        return [action, infoState];
      }),
      filter((d) => Array.isArray(d) && typeof d[1] !== 'undefined'),
      switchMap((d) => {
        const action: any = d[0];
        const infoState: FinancialInfo = d[1];
        const code = action.payload.code;
        const type = action.payload.type;
        const termType = action.payload.termType;
        this.log.log({
          source: 'fi',
          group: 'sync_info',
          group1: code,
          group2: type,
          group3: termType,
          message: `[${action.payload.code}|${type}|${termType}] Request Page page[${action.payload.page}] `,
        });
        return from(
          getFinancialInfoPage(
            action.payload.code,
            type,
            termType,
            action.payload.page,
          ),
        ).pipe(
          map((res) => {
            if (Array.isArray(res) && res.length > 2) {
              return requestFinancialInfoAfterAction({
                type,
                termType,
                code: action.payload.code,
                data: res,
              });
            } else {
              return requestFinancialInfoErrorAction({
                error: new Error('wrong data format from source'),
              });
            }
          }),
          catchError((err: any) =>
            from(
              of(
                requestFinancialInfoErrorAction({
                  error: err,
                }),
              ),
            ),
          ),
        );
      }),
    );
  });

  @Effect()
  saveData$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(requestFinancialInfoAfterAction),
      withLatestFrom(state$, (v1, v2) => {
        const action: any = v1;
        const infoState: FinancialInfo = v2.infos.find(
          (_if) =>
            _if.code === action.payload.code &&
            _if.termType === action.payload.termType &&
            _if.type === action.payload.type,
        );

        return [action, infoState];
      }),
      filter((d) => Array.isArray(d) && typeof d[1] !== 'undefined'),
      switchMap((d) => {
        const action: any = d[0];
        const data = action.payload.data;
        const code = action.payload.code;
        const type = action.payload.type;
        const termType = action.payload.termType;

        if (Array.isArray(data[0]) && data[0].length === 0) {
          // Không có dữ liệu của page này
          this.log.log({
            source: 'fi',
            group: 'sync_info',
            group1: code,
            group2: type,
            group3: termType,
            message: `[${action.payload.code}|${type}|${termType}] Không có dữ liệu của page [${action.payload.page}] `,
          });

          return from(
            of(
              saveFinanceInfoPageAfterAction({
                code,
                termType,
                type,
              }),
            ),
          );
        }

        return from(
          saveFinanceInfo(action.payload.code, data, type, termType),
        ).pipe(
          map(() => {
            this.log.log({
              source: 'fi',
              group: 'sync_info',
              group1: code,
              group2: type,
              group3: termType,
              message: `[${action.payload.code}|${type}|${termType}] Save thành công [${action.payload.page}] `,
            });
            return saveFinanceInfoPageAfterAction({
              code,
              termType,
              type,
            });
          }),
          catchError((error) => {
            this.log.log({
              level: Levels.error,
              source: 'fi',
              group: 'sync_info',
              group1: code,
              group2: type,
              group3: termType,
              message: `Error [${action.payload.code}|${type}|${termType}] Save thất bại [${action.payload.page}] `,
            });
            return from(
              of(
                saveFinanceInfoPageErrorAction({
                  code,
                  termType,
                  type,
                  error,
                }),
              ),
            );
          }),
        );
      }),
    ),
  );

  @Effect()
  repeat$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(saveFinanceInfoPageAfterAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.financialIndicator]),
      map((d) => {
        const financialIndicatorState: FinancialIndicatorState = d[1];

        if (financialIndicatorState.page === 1) {
          logger.info(`[${financialIndicatorState.code}] Finish`);
          return finishGetFinanceInfoAfterAction({});
        } else {
          logger.info(`[${financialIndicatorState.code}] Repeat`);
          return requestFinancialIndicatorAction({
            code: financialIndicatorState.code,
            page: financialIndicatorState.page - 1,
          });
        }
      }),
    ),
  );

  @Effect()
  whenFinish$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(finishGetFinanceInfoAfterAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.financialIndicator]),
      map((d) => {
        const financialIndicatorState: FinancialIndicatorState = d[1];
        if (financialIndicatorState.termType == FinancialTermTypeEnum.YEAR) {
          SyncFinancialIndicatorYearConsumer.resolve();
        } else {
          SyncFinancialIndicatorQuarterConsumer.resolve();
        }
        return EMPTY;
      }),
    ),
  );
}
