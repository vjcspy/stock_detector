import { createEffect } from '@module/core/util/store/createEffect';
import {
  finishGetFinanceInfoAfterAction,
  requestFinancialIndicatorAction,
  requestFinancialIndicatorAfterAction,
  requestFinancialIndicatorErrorAction,
  saveFinanceInfoPageAfterAction,
  saveFinanceInfoPageErrorAction,
  startGetFinanceInfoAction,
} from '@module/finan-info/store/financial-indicator/financial-indicator.actions';
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
import { getFinanceInfoStatus } from '@module/finan-info/store/financial-indicator/fns/getFinanceInfoStatus';
import {
  FinancialIndicatorState,
  FinancialTermTypeEnum,
} from '@module/finan-info/store/financial-indicator/financial-indicator.reducer';
import moment from 'moment';
import { FinancialIndicatorValues } from '@module/finan-info/store/financial-indicator/financial-indicator.values';
import { retrieveFinanceInfo } from '@module/finan-info/requests/vietstock/financeInfo';
import { saveFinanceInfo } from '@module/finan-info/store/financial-indicator/fns/saveFinaceInfo';
import { SyncFinancialIndicatorYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorYear.consumer';
import { SyncFinancialIndicatorQuarterConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorQuarter.consumer';
import { financialIndicatorLogger } from '@module/finan-info/store/financial-indicator/financial-indicator.logger';
import { Injectable } from '@nestjs/common';
import { LogService } from '@module/core/service/log.service';
import { Effect } from '@module/core/decorator/store-effect';

const logger = financialIndicatorLogger();

@Injectable()
export class FinancialIndicatorEffects {
  constructor(private log: LogService) {}

  @Effect()
  whenStartSync$ = createEffect((action$) => {
    return action$.pipe(
      ofType(startGetFinanceInfoAction),
      switchMap((action) => {
        const code = action.payload.code;
        const termType = action.payload.termType;
        return from(getFinanceInfoStatus(code, termType)).pipe(
          map((syncStatus) => {
            logger.info(`[${action.payload.code}] Start get data`);
            if (syncStatus) {
              logger.info(
                `[${action.payload.code}] Có dữ liệu quá khứ ${JSON.stringify(
                  syncStatus,
                  undefined,
                  2,
                )}`,
              );
              if (parseInt(syncStatus.year) < moment().year() - 1) {
                /*
                 * Trường hợp này là đã chạy trước đó nhung bị dừng đột ngột
                 * Do không biết với năm hiện tại thì đang ở page nào nên bắt buốc phải request lại từ đầu
                 * Truyền vào lastYear nhằm mục đích là CÓ THỂ dùng để filter chỉ update những thằng sau lastYear thôi
                 * */
                return requestFinancialIndicatorAction({
                  code,
                  page:
                    termType === FinancialTermTypeEnum.YEAR
                      ? FinancialIndicatorValues.START_PAGE_FOR_YEAR
                      : FinancialIndicatorValues.START_PAGE_FOR_QUARTER,
                  lastYear: parseInt(syncStatus.year),
                });
              } else {
                // Vẫn lấy page đầu tiên trong trường hợp có update (Chưa kiểm toán, kiểm toán)
                return requestFinancialIndicatorAction({
                  code,
                  page: 1,
                  lastYear: moment().year() - 1,
                });
              }
            } else {
              logger.info(`[${action.payload.code}] Không có dữ liệu quá khứ`);
              // Chưa request bao giờ
              return requestFinancialIndicatorAction({
                code,
                page:
                  termType === FinancialTermTypeEnum.YEAR
                    ? FinancialIndicatorValues.START_PAGE_FOR_YEAR
                    : FinancialIndicatorValues.START_PAGE_FOR_QUARTER,
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
      ofType(requestFinancialIndicatorAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.financialIndicator]),
      switchMap((d) => {
        const action: any = d[0];
        const financialIndicatorState: FinancialIndicatorState = d[1];
        logger.info(
          `[${action.payload.code}] Request Page page[${action.payload.page}] term type ${financialIndicatorState.termType}`,
        );
        return from(
          retrieveFinanceInfo(
            action.payload.code,
            financialIndicatorState.termType,
            action.payload.page,
          ),
        ).pipe(
          map((res) => {
            if (Array.isArray(res) && res.length > 2) {
              return requestFinancialIndicatorAfterAction({
                code: action.payload.code,
                data: res,
              });
            } else {
              return requestFinancialIndicatorErrorAction({
                error: new Error('wrong data format from source'),
              });
            }
          }),
          catchError((err: any) =>
            from(
              of(
                requestFinancialIndicatorErrorAction({
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
      ofType(requestFinancialIndicatorAfterAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.financialIndicator]),
      switchMap((d) => {
        const action: any = d[0];
        const financialIndicatorState: FinancialIndicatorState = d[1];
        const data = action.payload.data;

        if (Array.isArray(data[0]) && data[0].length === 0) {
          // Không có dữ liệu của page này
          logger.info(`[${action.payload.code}] Không có dữ liệu`);
          return from(of(saveFinanceInfoPageAfterAction({})));
        }

        return from(
          saveFinanceInfo(
            action.payload.code,
            data,
            financialIndicatorState.termType,
          ),
        ).pipe(
          map(() => {
            logger.info(`[${action.payload.code}] Save Page thành công`);
            return saveFinanceInfoPageAfterAction({});
          }),
          catchError((error) => {
            logger.info(
              `[${action.payload.code}] Save Page thất bại ${error.toString()}`,
            );
            return from(
              of(
                saveFinanceInfoPageErrorAction({
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
