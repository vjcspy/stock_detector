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
import { Injectable } from '@nestjs/common';
import { LogService } from '@module/core/service/log.service';
import { Effect } from '@module/core/decorator/store-effect';
import { getFinanceInfoStatus } from '@module/finan-info/store/financial-info/fns/getFinanceInfoStatus';
import { FinancialTermTypeEnum } from '@module/finan-info/entity/financial-info-status.entity';
import {
  finishGetFinanceInfoAfterAction,
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
        const code = action.payload.code;
        const type = action.payload.type;
        const termType = action.payload.termType;
        const page = action.payload.page;
        this.log.log({
          source: 'fi',
          group: 'sync_info',
          group1: code,
          group2: type,
          group3: termType,
          message: `[${action.payload.code}|${type}|${termType}] Request Page page[${action.payload.page}] `,
        });
        return from(getFinancialInfoPage(code, type, termType, page)).pipe(
          map((res) => {
            if (Array.isArray(res) && res.length > 2) {
              return requestFinancialInfoAfterAction({
                type,
                termType,
                code: action.payload.code,
                data: res,
                page,
              });
            } else {
              return requestFinancialInfoErrorAction({
                error: new Error('wrong data format from source'),
                type,
                termType,
                code: action.payload.code,
                page,
              });
            }
          }),
          catchError((err: any) =>
            from(
              of(
                requestFinancialInfoErrorAction({
                  error: err,
                  type,
                  termType,
                  code: action.payload.code,
                  page,
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
        const page = action.payload.page;

        if (Array.isArray(data[0]) && data[0].length === 0) {
          // Không có dữ liệu của page này
          this.log.log({
            source: 'fi',
            group: 'sync_info',
            group1: code,
            group2: type,
            group3: termType,
            message: `[${action.payload.code}|${type}|${termType}] Không có dữ liệu của page [${page}] `,
          });

          return from(
            of(
              saveFinanceInfoPageAfterAction({
                code,
                termType,
                type,
                page,
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
              message: `[${action.payload.code}|${type}|${termType}] Save thành công [${page}] `,
            });
            return saveFinanceInfoPageAfterAction({
              code,
              termType,
              type,
              page,
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
              message: `Error [${action.payload.code}|${type}|${termType}] Save thất bại [${page}] `,
              metadata: {
                error,
              },
            });
            return from(
              of(
                saveFinanceInfoPageErrorAction({
                  code,
                  termType,
                  type,
                  page,
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
      map((d) => {
        const action: any = d[0];
        const code = action.payload.code;
        const type = action.payload.type;
        const termType = action.payload.termType;
        const page = action.payload.page;

        if (page === 1) {
          this.log.log({
            source: 'fi',
            group: 'sync_info',
            group1: code,
            group2: type,
            group3: termType,
            message: `[${action.payload.code}|${type}|${termType}] ___________ FINISH PAGE [${page}] `,
          });
          return finishGetFinanceInfoAfterAction({
            code,
            type,
            termType,
          });
        } else {
          this.log.log({
            source: 'fi',
            group: 'sync_info',
            group1: code,
            group2: type,
            group3: termType,
            message: `[${
              action.payload.code
            }|${type}|${termType}] ___________ REPEAT page [${page - 1}] `,
          });
          return requestFinancialInfoAction({
            code,
            type,
            termType,
            page: page - 1,
          });
        }
      }),
    ),
  );

  @Effect()
  whenFinish$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(finishGetFinanceInfoAfterAction),
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
      map((d) => {
        const infoState: FinancialInfo = d[1];
        const action: any = d[0];
        const code = action.payload.code;
        const type = action.payload.type;
        const termType = action.payload.termType;

        if (typeof infoState?.resolve === 'function') {
          infoState.resolve();
        }
        return EMPTY;
      }),
    ),
  );

  @Effect()
  whenError$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(requestFinancialInfoErrorAction, saveFinanceInfoPageErrorAction),
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
      map((d) => {
        const infoState: FinancialInfo = d[1];
        const action: any = d[0];
        const code = action.payload.code;
        const type = action.payload.type;
        const termType = action.payload.termType;

        if (typeof infoState?.reject === 'function') {
          infoState.reject();
        }
        return EMPTY;
      }),
    ),
  );
}
