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

const whenStartSync$ = createEffect((action$) => {
  return action$.pipe(
    ofType(startGetFinanceInfoAction),
    switchMap((action) => {
      const code = action.payload.code;
      const termType = action.payload.termType;
      return from(getFinanceInfoStatus(code, termType)).pipe(
        map((syncStatus) => {
          if (syncStatus) {
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
      const data = action.payload.data;

      return from(
        saveFinanceInfo(
          action.payload.code,
          data,
          financialIndicatorState.termType,
        ),
      ).pipe(
        map(() => {
          return saveFinanceInfoPageAfterAction({});
        }),
        catchError((error) =>
          from(
            of(
              saveFinanceInfoPageErrorAction({
                error,
              }),
            ),
          ),
        ),
      );
    }),
  ),
);

const repeat$ = createEffect((action$, state$) =>
  action$.pipe(
    ofType(saveFinanceInfoPageAfterAction),
    withLatestFrom(state$, (v1, v2) => [v1, v2.financialIndicator]),
    map((d) => {
      const financialIndicatorState: FinancialIndicatorState = d[1];

      if (financialIndicatorState.page === 1) {
        return finishGetFinanceInfoAfterAction({});
      } else {
        return requestFinancialIndicatorAction({
          code: financialIndicatorState.code,
          page: financialIndicatorState.page - 1,
        });
      }
    }),
  ),
);

export const FinancialIndicatorEffects = [
  whenStartSync$,
  requestFinancialInfoPage$,
  saveData$,
  repeat$,
];
