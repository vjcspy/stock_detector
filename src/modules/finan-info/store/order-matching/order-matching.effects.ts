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
import { catchError, EMPTY, from, map, mergeMap, of } from 'rxjs';
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
  // TODO: Hiện tại không hỗ trợ paging mà lấy luôn full
  static PAGE_SIZE = 50000;

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
        const syncStatusKey = this.getJobIdInfo(code, type);

        this.jobSyncStatusService.saveInfo(syncStatusKey, {
          resolve,
        });
        return from(this.jobSyncStatusService.getStatus(syncStatusKey)).pipe(
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
  request$ = createEffect((action$) =>
    action$.pipe(
      ofType(requestOrderMatchingPage.ACTION),
      mergeMap((action) => {
        const code = action.payload.code;
        const page = action.payload.page ?? 0;
        const type = action.payload.type;

        const url =
          type === OrderMatchingType.INVESTOR
            ? `https://apipubaws.tcbs.com.vn/stock-insight/v1/intraday/${code}/investor/his/paging?page=0&size=${SyncOrderMatchingEffects.PAGE_SIZE}`
            : `https://apipubaws.tcbs.com.vn/stock-insight/v1/intraday/${code}/his/paging?page=0&size=${SyncOrderMatchingEffects.PAGE_SIZE}`;

        return this.httpService.get(url).pipe(
          map((res) => {
            if (res?.data?.size !== SyncOrderMatchingEffects.PAGE_SIZE) {
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
                message: `[${action.payload.code}|${type}] Unknown Error`,
              });
              return syncOrderMatching.ERROR({
                code,
                type,
                error: new Error('Unknown Error'),
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
  saveData$ = createEffect((action$) =>
    action$.pipe(
      ofType(requestOrderMatchingPage.AFTER),
      mergeMap((action) => {
        const { code, type, page, data } = action.payload;

        return from(this.saveOrderMatching(code, type, data)).pipe(
          map(() => {
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
          }),
          catchError((error: any) => {
            this.log.log({
              level: Levels.error,
              source: 'fi',
              group: 'sync_om',
              group1: code,
              group2: type,
              message: `[${action.payload.code}|${type}] ${error?.toString()}`,
            });
            return from(
              of(
                syncOrderMatching.ERROR({
                  code,
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
          this.log.log({
            source: 'fi',
            group: 'sync_om',
            group1: code,
            group2: type,
            message: `_________ [${action.payload.code}|${type}] DONE _________`,
          });
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
      mergeMap((action) => {
        const { code, type, error } = action.payload;
        const info = this.jobSyncStatusService.getInfo(
          this.getJobIdInfo(code, type),
        );

        return from(
          this.jobSyncStatusService.saveErrorStatus(
            this.getJobIdInfo(code, type),
            error,
          ),
        ).pipe(
          map(() => {
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
          catchError((e) => {
            this.log.log({
              level: Levels.error,
              source: 'fi',
              group: 'sync_om',
              group1: code,
              group2: type,
              message: `[${
                action.payload.code
              }|${type}] Không thể xử lý lỗi ${e?.toString()}`,
            });
            return from(of(EMPTY));
          }),
        );
      }),
    ),
  );

  private getJobIdInfo(code, type) {
    return `sync_om_${code}_${type}`;
  }

  private async saveOrderMatching(code: string, type: number, data: any) {
    if (!(data?.data?.length > 0)) {
      throw new Error('Không có dữ liệu để save');
    }
    const _day = data.d;

    if (typeof _day !== 'string') {
      throw new Error('Dữ liệu trả về bị lỗi');
    }
    const syncDate = moment(`${moment().year()}/${_day}`, 'YYYY/DD/MM');
    const docs = _.map(data.data, (meta) => {
      return new this.orderMatchingModel({
        code,
        type,
        meta,
        date: syncDate.toDate(),
      });
    });

    // Xoá các bản ghi của ngày hôm đó
    await this.orderMatchingModel.deleteMany({
      date: {
        $gte: syncDate.toDate(),
      },
    });

    // save docs
    const _saveRes = await this.orderMatchingModel.bulkSave(docs);

    if (
      _saveRes?.result?.ok == 1 &&
      _saveRes?.result?.writeErrors?.length === 0
    ) {
    } else {
      throw new Error('Error save data');
    }

    await this.jobSyncStatusService.saveSuccessStatus(
      this.getJobIdInfo(code, type),
      {
        k: this.getJobIdInfo(code, type),
        s: true,
        date: moment().toDate(),
        meta: null,
      },
    );
  }
}
