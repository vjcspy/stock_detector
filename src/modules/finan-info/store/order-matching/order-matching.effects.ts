import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import {
  requestOrderMatchingPage,
  saveOrderMatchingPage,
  syncOrderMatching,
} from '@module/finan-info/store/order-matching/order-matching.actions';
import { Injectable } from '@nestjs/common';
import { Effect } from '@module/core/decorator/store-effect';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderMatching,
  OrderMatchingDocument,
  OrderMatchingType,
} from '@module/finan-info/schema/order-matching.schema';
import { catchError, EMPTY, from, map, mergeMap, of, switchMap } from 'rxjs';
import { JobSyncStatusService } from '@module/finan-info/service/job-sync-status.service';
import moment from 'moment';
import { LogService } from '@module/core/service/log.service';
import { filter } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { Levels } from '@module/core/schemas/log-db.schema';
import _ from 'lodash';
import { Nack } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class SyncOrderMatchingEffects {
  constructor(
    @InjectModel(OrderMatching.name)
    private orderMatchingModel: Model<OrderMatchingDocument>,
    private readonly jobSyncStatusService: JobSyncStatusService,
    private log: LogService,
    private httpService: HttpService,
  ) {}

  @Effect()
  startSyncOrderMatching = createEffect((action$) =>
    action$.pipe(
      ofType(syncOrderMatching.ACTION),
      mergeMap((action) => {
        const { code, type, resolve } = action.payload;

        const jobType = `om_${action.payload.type}`;
        this.jobSyncStatusService.saveInfo(this.getJobIdInfo(code, type), {
          resolve,
        });
        return from(
          this.jobSyncStatusService.getStatus(action.payload.code, jobType),
        ).pipe(
          map((syncStatus) => {
            if (syncStatus) {
              this.log.log({
                source: 'fi',
                group: 'sync_om',
                group1: code,
                group2: type,
                message: `_________ [${action.payload.code}|${type}] START _________`,
              });
              // check current date
              const date = moment(syncStatus.date);
              const curDate = moment();

              if (
                syncStatus.s === false &&
                date.isSame(curDate, 'day') &&
                syncStatus.n > 3
              ) {
                this.log.log({
                  level: Levels.error,
                  source: 'fi',
                  group: 'sync_om',
                  group1: code,
                  group2: type,
                  message: `[${action.payload.code}|${type}] Sync fail quá nhiều`,
                });
                return EMPTY;
              } else if (syncStatus.s === true && date.isSame(curDate, 'day')) {
                this.log.log({
                  source: 'fi',
                  group: 'sync_om',
                  group1: code,
                  group2: type,
                  message: `[${action.payload.code}|${type}] UPDATED`,
                });
                return syncOrderMatching.AFTER({
                  code,
                  type,
                });
              }
            }

            return requestOrderMatchingPage.ACTION({
              code,
              type,
            });
          }),
        );
      }),
    ),
  );

  @Effect()
  pageTypeInvestor = createEffect((action$) =>
    action$.pipe(
      ofType(requestOrderMatchingPage.ACTION),
      filter((action) => action.payload.type === OrderMatchingType.INVESTOR),
      mergeMap((action) => {
        const code = action.payload.code;
        const page = action.payload.page ?? 0;
        const type = action.payload.type;

        /*
         * Hiện tại có 1 quy tắc là chỉ pull 1 page, không hỗ trợ repeat page do sợ bị trùng lặp dữ liệu khi save lỗi
         * */
        return this.httpService
          .get(
            `https://apipubaws.tcbs.com.vn/stock-insight/v1/intraday/${code}/investor/his/paging?page=${page}&size=10000`,
          )
          .pipe(
            map((res) => {
              if (res?.data?.size !== 10000) {
                this.log.log({
                  level: Levels.error,
                  source: 'fi',
                  group: 'sync_om',
                  group1: code,
                  group2: type,
                  message: `[${action.payload.code}|${type}] API nguồn đã có sự thay đổi, không support lấy full`,
                });
                return syncOrderMatching.ERROR({
                  code,
                  type,
                  error: new Error(
                    'API nguồn đã có sự thay đổi, không support lấy full',
                  ),
                });
              }

              if (Array.isArray(res.data.data)) {
                const total = res?.data?.total;
                if (res.data.data.length === 0 || total === 0) {
                  this.log.log({
                    source: 'fi',
                    group: 'sync_om',
                    group1: code,
                    group2: type,
                    message: `[${action.payload.code}|${type}] Không có dữ liệu giao dịch ${page}`,
                  });
                  return syncOrderMatching.AFTER({
                    code,
                    type,
                  });
                }

                if (total > 0 && total < res?.data?.size) {
                  this.log.log({
                    source: 'fi',
                    group: 'sync_om',
                    group1: code,
                    group2: type,
                    message: `[${action.payload.code}|${type}] Lấy dữ liệu page ${page} successful`,
                  });
                  return requestOrderMatchingPage.AFTER({
                    code,
                    page,
                    type,
                    data: res.data,
                  });
                }

                this.log.log({
                  level: Levels.error,
                  source: 'fi',
                  group: 'sync_om',
                  group1: code,
                  group2: type,
                  message: `[${action.payload.code}|${type}] Unknow Error`,
                });
                return syncOrderMatching.ERROR({
                  code,
                  type,
                  error: new Error('Unknow Error'),
                });
              } else {
                this.log.log({
                  level: Levels.error,
                  source: 'fi',
                  group: 'sync_om',
                  group1: code,
                  group2: type,
                  message: `[${action.payload.code}|${type}] Response data wrong format`,
                });
                return requestOrderMatchingPage.ERROR({
                  code,
                  page,
                  type,
                  error: new Error('Response data wrong format'),
                });
              }
            }),
          );
      }),
    ),
  );

  @Effect()
  saveData = createEffect((action$) =>
    action$.pipe(
      ofType(requestOrderMatchingPage.AFTER),
      mergeMap((action) => {
        const { code, type, page, data } = action.payload;
        const documents = _.map(data.data, (meta) => {
          return new this.orderMatchingModel({
            code,
            type,
            meta,
          });
        });

        return from(
          this.orderMatchingModel.deleteMany({
            date: {
              $gt: moment().subtract(1, 'days').toDate(),
            },
          }),
        ).pipe(
          switchMap((_dRes) => {
            return from(this.orderMatchingModel.bulkSave(documents)).pipe(
              map((res) => {
                if (
                  res?.result?.ok == 1 &&
                  res?.result?.writeErrors?.length === 0
                ) {
                  this.log.log({
                    source: 'fi',
                    group: 'sync_om',
                    group1: code,
                    group2: type,
                    message: `[${action.payload.code}|${type}] Save data OK`,
                  });
                  return saveOrderMatchingPage.AFTER({
                    code,
                    page,
                    type,
                  });
                } else {
                  this.log.log({
                    level: Levels.error,
                    source: 'fi',
                    group: 'sync_om',
                    group1: code,
                    group2: type,
                    message: `[${action.payload.code}|${type}] Save data error`,
                    metadata: res,
                  });
                  return saveOrderMatchingPage.ERROR({
                    code,
                    page,
                    type,
                  });
                }
              }),
            );
          }),
          catchError((error) =>
            from(
              of(
                syncOrderMatching.ERROR({
                  code,
                  type,
                  error,
                }),
              ),
            ),
          ),
        );
      }),
    ),
  );

  @Effect()
  ackQueue = createEffect((action$) =>
    action$.pipe(
      ofType(syncOrderMatching.AFTER, saveOrderMatchingPage.AFTER),
      map((action) => {
        const { code, type } = action.payload;
        const info = this.jobSyncStatusService.getInfo(
          this.getJobIdInfo(code, type),
        );

        if (info && typeof info?.meta?.resolve === 'function') {
          info.meta.resolve();
        } else {
          this.log.log({
            level: Levels.error,
            source: 'fi',
            group: 'sync_om',
            group1: code,
            group2: type,
            message: `[${action.payload.code}|${type}] COULD NOT ACK QUEUE, NOT FOUND INFO`,
          });
        }

        return EMPTY;
      }),
    ),
  );

  @Effect()
  nAckQueue = createEffect((action$) =>
    action$.pipe(
      ofType(
        syncOrderMatching.ERROR,
        saveOrderMatchingPage.ERROR,
        requestOrderMatchingPage.ERROR,
      ),
      map((action) => {
        const { code, type } = action.payload;
        const info = this.jobSyncStatusService.getInfo(
          this.getJobIdInfo(code, type),
        );

        if (info && typeof info?.meta?.resolve === 'function') {
          this.log.log({
            source: 'fi',
            group: 'sync_om',
            group1: code,
            group2: type,
            message: `[${action.payload.code}|${type}] RETRY`,
          });
          info.meta.resolve(new Nack(true));
        } else {
          this.log.log({
            level: Levels.error,
            source: 'fi',
            group: 'sync_om',
            group1: code,
            group2: type,
            message: `[${action.payload.code}|${type}] COULD NOT NACK QUEUE, NOT FOUND INFO`,
          });
        }

        return EMPTY;
      }),
    ),
  );

  private getJobIdInfo(code, type) {
    return `sync_om_${code}_${type}`;
  }
}
