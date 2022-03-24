import moment from 'moment';
import {
  concatMap,
  EMPTY,
  from,
  map,
  retry,
  switchMap,
  withLatestFrom,
} from 'rxjs';

import { getCurrentStatus, saveErrorStatus } from './fns/getCurrentStatus';
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
import { Nack } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Effect } from '@module/core/decorator/store-effect';
import { LogService } from '@module/core/service/log.service';
import { Levels } from '@module/core/schemas/log-db.schema';
import { StockPriceState } from '@module/finan-info/store/stock-price/stock-price.reducer';

@Injectable()
export class StockPriceEffects {
  constructor(private log: LogService) {}

  @Effect()
  checkStockPriceStatus$ = createEffect((action$) =>
    action$.pipe(
      ofType(stockPricesStartAction),
      concatMap((action) => {
        return from(getCurrentStatus(action.payload.code)).pipe(
          map((currentStatus) => {
            const curDate = moment();
            this.log.log({
              source: 'fi',
              group: 'sync_price',
              group1: action.payload.code,
              message: `_________ START [${action.payload.code}] _________`,
            });
            if (currentStatus && currentStatus?.lastDate) {
              const lastDate = moment(currentStatus.lastDate);
              if (lastDate.isSameOrBefore(curDate)) {
                this.log.log({
                  source: 'fi',
                  group: 'sync_price',
                  group1: action.payload.code,
                  message: `Lấy dữ liệu từ ngày ${lastDate.format(
                    'YYYY-MM-DD',
                  )}`,
                  metadata: {
                    lastDate: lastDate.format('YYYY-MM-DD'),
                    curDate: curDate.format('YYYY-MM-DD'),
                  },
                });
                return getStockPricesAction({
                  code: action.payload.code,
                  lastDate,
                  endDate: curDate,
                });
              } else {
                this.log.log({
                  source: 'fi',
                  group: 'sync_price',
                  group1: action.payload.code,
                  message: `_________ DATA UPDATED _________`,
                });
                return stockPricesFinishedAction({
                  code: action.payload.code,
                });
              }
            } else {
              const lastDate = moment(`${StockPriceValues.START_YEAR}-01-01`);
              this.log.log({
                source: 'fi',
                group: 'sync_price',
                group1: action.payload.code,
                message: `Chưa có dữ liệu, lấy từ đầu`,
              });
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

  @Effect()
  getStockPrice$ = createEffect((action$) =>
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
              this.log.log({
                level: Levels.error,
                source: 'fi',
                group: 'sync_price',
                group1: action.payload.code,
                message: `Error: Không lấy được dữ liệu từ bsc`,
              });
              return getStockPricesErrorAction({
                error: new Error('could not get price data'),
              });
            } else {
              this.log.log({
                source: 'fi',
                group: 'sync_price',
                group1: action.payload.code,
                message: `Lấy dữ liệu thành công`,
              });
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

  @Effect()
  whenGotStockPrices$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(getStockPricesAfterAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.stockPrices]),
      concatMap((d) => {
        const action = d[0];
        return from(
          savePrices(action.payload.code, { items: action.payload.data }),
        ).pipe(
          map((res) => {
            if (res.syncSuccess === true) {
              this.log.log({
                source: 'fi',
                group: 'sync_price',
                group1: action.payload.code,
                message: `Save dữ liệu thành công`,
              });
              return saveStockPriceAfterAction({
                code: action.payload.code,
              });
            } else {
              this.log.log({
                level: Levels.error,
                source: 'fi',
                group: 'sync_price',
                group1: action.payload.code,
                message: `Error: Save dữ liệu thất bại`,
              });
              return saveStockPriceErrorAction({
                error: res.error,
              });
            }
          }),
        );
      }),
    ),
  );

  @Effect()
  handleFinishSave$ = createEffect((action$) =>
    action$.pipe(
      ofType(saveStockPriceAfterAction),
      map((action) => {
        this.log.log({
          source: 'fi',
          group: 'sync_price',
          group1: action.payload.code,
          message: `________ FINISHED [${action.payload.code}] ________`,
        });
        return stockPricesFinishedAction({ code: action.payload.code });
      }),
    ),
  );

  @Effect()
  whenFinish$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(stockPricesFinishedAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.stockPrices]),
      map((d) => {
        const action = d[0];
        const stockPriceState: StockPriceState = d[1];
        if (typeof stockPriceState?.resolve === 'function') {
          this.log.log({
            source: 'fi',
            group: 'sync_price',
            group1: action.payload.code,
            message: `Next queue`,
          });
          // setTimeout(() => {
          stockPriceState.resolve();
          // }, 2000);
        }

        return EMPTY;
      }),
    ),
  );

  @Effect()
  handleError$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(saveStockPriceErrorAction, getStockPricesErrorAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.stockPrices]),
      switchMap((d) => {
        const action = d[0];
        const stockPriceState: StockPriceState = d[1];

        return from(
          saveErrorStatus(stockPriceState.code, action?.payload?.error),
        ).pipe(
          map((currentStatus) => {
            if (currentStatus) {
              const lastUpdateDate = moment(currentStatus.lastUpdateDate);
              if (lastUpdateDate.isSame(moment(), 'day')) {
                if (currentStatus.try > 3) {
                  this.log.log({
                    level: Levels.error,
                    source: 'fi',
                    group: 'sync_price',
                    group1: action.payload.code,
                    message: `ERROR: Reached the maximum pull attempts`,
                  });
                  setTimeout(() => {
                    stockPriceState.resolve(new Nack(false));
                  }, 2000);
                } else {
                  this.log.log({
                    level: Levels.error,
                    source: 'fi',
                    group: 'sync_price',
                    group1: action.payload.code,
                    message: `Retry time ${currentStatus.try}`,
                  });
                  setTimeout(() => {
                    stockPriceState.resolve(new Nack(true));
                  }, 2000);
                }
              }
            } else {
              if (typeof stockPriceState?.resolve === 'function') {
                this.log.log({
                  level: Levels.error,
                  source: 'fi',
                  group: 'sync_price',
                  group1: action.payload.code,
                  message: `Retry`,
                });
                setTimeout(() => {
                  stockPriceState.resolve(new Nack(true));
                }, 2000);
              }

              return EMPTY;
            }

            return EMPTY;
          }),
        );
      }),
      // }),
    ),
  );
}
