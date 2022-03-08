import { createEffect } from '@module/core/util/store/createEffect';
import {
  requestFinancialIndicatorAction,
  requestFinancialIndicatorAfterAction,
  requestFinancialIndicatorErrorAction,
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

const whenStartSync$ = createEffect((action$) => {
  return action$.pipe(
    ofType(startGetFinanceInfoAction),
    switchMap((action) => {
      const code = action.payload.code;
      const termType = action.payload.termType;
      return from(getFinanceInfoStatus(code, termType)).pipe(
        map((syncStatus) => {
          if (syncStatus) {
            if (syncStatus.termType === 1) {
              if (parseInt(syncStatus.year) < moment().year() - 1) {
                /*
                 * Trường hợp này là đã chạy trước đó nhung bị dừng đột ngột
                 * Do không biết với năm hiện tại thì đang ở page nào nên bắt buốc phải request lại từ đầu
                 * Truyền vào lastYear nhằm mục đích là CÓ THỂ dùng để filter chỉ update những thằng sau lastYear thôi
                 * */
                return requestFinancialIndicatorAction({
                  code,
                  page: FinancialIndicatorValues.START_PAGE_FOR_YEAR,
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
              if (parseInt(syncStatus.year) < moment().year() - 1) {
                return requestFinancialIndicatorAction({
                  code,
                  page: FinancialIndicatorValues.START_PAGE_FOR_QUARTER,
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
            }
          } else {
            // Chưa request bao giờ
            return requestFinancialIndicatorAction({
              code,
              page: termType === FinancialTermTypeEnum.YEAR ? 5 : 8,
            });
          }
        }),
      );
    }),
  );
});

const requestFinancialInfoPage$ = createEffect((action$, state$) =>
  action$.pipe(
    ofType(requestFinancialIndicatorAction),
    withLatestFrom(state$, (v1, v2) => [v1, v2.financialIndicator]),
    switchMap((d) => {
      const action: any = d[0];
      const financialIndicatorState: FinancialIndicatorState = d[1];
      return from(
        retrieveFinanceInfo(
          action.payload.code,
          financialIndicatorState.termType,
          action.payload.page,
        ),
      ).pipe(
        map((res) => {
          return requestFinancialIndicatorAfterAction({
            code: action.payload.code,
            data: res,
          });
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
  ),
);

const saveData$ = createEffect((action$, state$) =>
  action$.pipe(
    ofType(requestFinancialIndicatorAfterAction),
    withLatestFrom(state$, (v1, v2) => [v1, v2.financialIndicator]),
    switchMap((d) => {
      const action: any = d[0];
      const financialIndicatorState: FinancialIndicatorState = d[1];

      return from(
        saveFinanceInfo(
          action.payload.code,
          action.payload.data,
          financialIndicatorState.termType,
        ),
      ).pipe(
        map((res) => {
          return EMPTY;
        }),
      );
    }),
  ),
);

export const FinancialIndicatorEffects = [
  whenStartSync$,
  requestFinancialInfoPage$,
  saveData$,
];
