import moment from 'moment';
import { concatMap, EMPTY, from, map, of, withLatestFrom } from 'rxjs';

import { getCurrentStatus } from './fns/getCurrentStatus';
import { savePrices } from './fns/savePrices';
import { StockPriceState } from './stock-price.reducer';
import {
  getStockPricesAction,
  getStockPricesAfterAction,
  getStockPricesErrorAction,
  saveStockPriceAfterAction,
  saveStockPriceErrorAction,
  stockPricesFinishedAction,
  stockPricesStartAction,
} from './stock-prices.actions';
import { StockPricesValues } from './stock-prices.values';
import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import { getPrice } from '@module/finan-info/requests/vndirect/price';

const checkStockPriceStatus$ = createEffect((action$) =>
  action$.pipe(
    ofType(stockPricesStartAction),
    concatMap((action) => {
      return from(getCurrentStatus(action.payload.code)).pipe(
        map((currentStatus) => {
          if (currentStatus) {
            const lastDate = moment(currentStatus.lastDate);
            if (lastDate.year() < moment().year()) {
              return getStockPricesAction({
                code: action.payload.code,
                year: lastDate.year() + 1,
              });
            } else {
              return getStockPricesAction({
                code: action.payload.code,
                year: lastDate.year(),
                lastDate,
              });
            }
          } else {
            return getStockPricesAction({
              code: action.payload.code,
              year: StockPricesValues.START_YEAR,
            });
          }
        }),
      );
    }),
  ),
);

const getStockPrice$ = createEffect((action$) =>
  action$.pipe(
    ofType(getStockPricesAction),
    concatMap((action) =>
      from(getPrice(action.payload.code, action.payload.year)).pipe(
        map((priceData) => {
          if (priceData === null) {
            return getStockPricesErrorAction({
              error: new Error('could not get price data'),
            });
          } else {
            return getStockPricesAfterAction({
              data: priceData,
              code: action.payload.code,
              year: action.payload.year,
            });
          }
        }),
      ),
    ),
  ),
);

const whenGotStockPrices$ = createEffect((action$, state$) =>
  action$.pipe(
    ofType(getStockPricesAfterAction),
    withLatestFrom(state$, (v1, v2) => [v1, v2.stockPrice]),
    concatMap((d) => {
      const action = d[0];
      const stockPriceState: StockPriceState = d[1];
      if (action.payload.data.totalElements === 0) {
        const successYear = action.payload.year;
        if (moment().year() > successYear) {
          return of(
            getStockPricesAction({
              code: action.payload.code,
              year: action.payload.year + 1,
            }),
          );
        } else {
          return of(
            stockPricesFinishedAction({
              code: action.payload.code,
            }),
          );
        }
      } else {
        const saveData = action.payload.data;
        if (!Array.isArray(saveData.data) || saveData.data.length === 0) {
          return of(
            saveStockPriceErrorAction({
              error: new Error('Tai sao du lieu lai tra ve rong'),
            }),
          );
        }

        if (action.payload.year === moment().year()) {
          const lastDate = stockPriceState.lastDate;
          saveData['data'] = saveData.data.filter((p: any) =>
            lastDate.isBefore(moment(p['date'], 'YYYY-MM-DD')),
          );
          if (saveData['data'].length === 0) {
            // khong co du lieu de save
            return of(stockPricesFinishedAction());
          }
        }

        return from(savePrices(action.payload.code, saveData)).pipe(
          map((res) => {
            if (res === true) {
              return saveStockPriceAfterAction({
                code: action.payload.code,
                year: action.payload.year,
              });
            } else {
              return saveStockPriceErrorAction({
                error: res,
              });
            }
          }),
        );
      }
    }),
  ),
);

const repeat$ = createEffect((action$) =>
  action$.pipe(
    ofType(saveStockPriceAfterAction),
    concatMap((action) => {
      const successYear = action.payload.year;
      if (moment().year() > successYear) {
        return of(
          getStockPricesAction({
            code: action.payload.code,
            year: action.payload.year + 1,
          }),
        );
      } else {
        return of(
          stockPricesFinishedAction({
            code: action.payload.code,
          }),
        );
      }
    }),
  ),
);

const exit$ = createEffect((action$) =>
  action$.pipe(
    ofType(stockPricesFinishedAction),
    map(() => {
      process.exit(0);
      return EMPTY;
    }),
  ),
);

export const stockPricesEffects = [
  checkStockPriceStatus$,
  getStockPrice$,
  whenGotStockPrices$,
  repeat$,
  exit$,
];
