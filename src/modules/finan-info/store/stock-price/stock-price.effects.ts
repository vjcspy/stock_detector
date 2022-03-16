import moment from 'moment';
import { concatMap, EMPTY, from, map, withLatestFrom } from 'rxjs';

import { getCurrentStatus } from './fns/getCurrentStatus';
import { savePrices } from './fns/savePrices';
import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import { getPriceFromBSC } from '@module/finan-info/requests/bsc/price.request';
import {
  getStockPricesAction,
  getStockPricesAfterAction,
  getStockPricesErrorAction,
  saveStockPriceAfterAction,
  saveStockPriceErrorAction,
  stockPricesFinishedAction,
  stockPricesStartAction,
} from '@module/finan-info/store/stock-price/stock-price.actions';
import { StockPriceValues } from '@module/finan-info/store/stock-price/stock-price.values';
import { SyncStockPriceConsumer } from '@module/finan-info/queue/consumer/SyncStockPrice.consumer';
import { Nack } from '@golevelup/nestjs-rabbitmq';

const checkStockPriceStatus$ = createEffect((action$) =>
  action$.pipe(
    ofType(stockPricesStartAction),
    concatMap((action) => {
      return from(getCurrentStatus(action.payload.code)).pipe(
        map((currentStatus) => {
          const curDate = moment();
          if (currentStatus) {
            const lastDate = moment(currentStatus.lastDate);
            if (lastDate.isSameOrBefore(curDate)) {
              return getStockPricesAction({
                code: action.payload.code,
                lastDate,
                endDate: curDate,
              });
            } else {
              return stockPricesFinishedAction({
                code: action.payload.code,
              });
            }
          } else {
            const lastDate = moment(`${StockPriceValues.START_YEAR}-01-01`);
            return getStockPricesAction({
              code: action.payload.code,
              lastDate,
              endDate: curDate,
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
      from(
        getPriceFromBSC(
          action.payload.code,
          action.payload.lastDate,
          action.payload.endDate,
        ),
      ).pipe(
        map((priceData) => {
          if (priceData === null) {
            return getStockPricesErrorAction({
              error: new Error('could not get price data'),
            });
          } else {
            return getStockPricesAfterAction({
              data: priceData,
              code: action.payload.code,
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
      return from(
        savePrices(action.payload.code, { items: action.payload.data }),
      ).pipe(
        map((res) => {
          if (res.syncSuccess === true) {
            return saveStockPriceAfterAction({
              code: action.payload.code,
            });
          } else {
            return saveStockPriceErrorAction({
              error: res.error,
            });
          }
        }),
      );
    }),
  ),
);

const handleFinishSave$ = createEffect((action$) =>
  action$.pipe(
    ofType(saveStockPriceAfterAction),
    map((action) => {
      return stockPricesFinishedAction({ code: action.payload.code });
    }),
  ),
);

const whenFinish$ = createEffect((action$) =>
  action$.pipe(
    ofType(stockPricesFinishedAction),
    map(() => {
      SyncStockPriceConsumer.resolve();
      return EMPTY;
    }),
  ),
);

const handleError$ = createEffect((action$) =>
  action$.pipe(
    ofType(saveStockPriceErrorAction),
    map(() => {
      SyncStockPriceConsumer.resolve(new Nack(true));
      return EMPTY;
    }),
  ),
);

export const stockPriceEffects = [
  checkStockPriceStatus$,
  getStockPrice$,
  whenGotStockPrices$,
  handleFinishSave$,
  whenFinish$,
  handleError$,
];
