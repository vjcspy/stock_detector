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
import { Injectable } from '@nestjs/common';
import { Effect } from '@module/core/decorator/store-effect';
import { LogService } from '@module/core/service/log.service';
import { Levels } from '@module/core/schemas/log-db.schema';

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
              message: `Start sync price ${action.payload.code}`,
            });
            if (currentStatus) {
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
                  message: `Finish. Đang là dữ liệu mới nhất`,
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
                message: `Lấy dữ liệu từ BSC thành công`,
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
      withLatestFrom(state$, (v1, v2) => [v1, v2.stockPrice]),
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
        return stockPricesFinishedAction({ code: action.payload.code });
      }),
    ),
  );

  @Effect()
  whenFinish$ = createEffect((action$) =>
    action$.pipe(
      ofType(stockPricesFinishedAction),
      map(() => {
        SyncStockPriceConsumer.resolve();
        return EMPTY;
      }),
    ),
  );

  @Effect()
  handleError$ = createEffect((action$) =>
    action$.pipe(
      ofType(saveStockPriceErrorAction, getStockPricesErrorAction),
      map(() => {
        SyncStockPriceConsumer.resolve(new Nack(true));
        return EMPTY;
      }),
    ),
  );
}
