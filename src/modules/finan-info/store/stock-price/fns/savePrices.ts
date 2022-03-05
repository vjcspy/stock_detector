import { getConnection } from 'typeorm';
import { StockPriceEntity } from '@module/finan-info/entity/stockPrice.entity';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stockPriceSyncStatus.entity';
import * as _ from 'lodash';
import moment from 'moment';

export const savePrices = async (code: string, priceData: { items: any[] }) => {
  let syncSuccess: any = false;
  let error: any = undefined;

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  try {
    // establish real database connection using our new query runner
    await queryRunner.connect();

    // lets now open a new transaction:
    await queryRunner.startTransaction();
    const stockPrices = _.chain(priceData.items)
      .map((sourcePriceData: any) =>
        // @ts-ignore
        new StockPriceEntity().convertSourceData(sourcePriceData),
      )
      .sortBy('date')
      .value();

    // NOTE: Hạnh phúc nhất là sử dụng được upsert nhưng thằng typeorm đang lỗi, do đó cần delete rồi gọi save lại
    const deleteJobs = [];
    const _priceChunks = _.chunk(stockPrices, 100);
    _priceChunks.forEach((_stockPrices: any) => {
      const _codesToDelete = _.chain(_stockPrices)
        .map((_d) => `"${_d['code']}"`)
        .uniq()
        .value()
        .join(',');

      const _datesToDelete = _.map(_stockPrices, (_d) => {
        return `"${moment(_d['date']).format('YYYY-MM-DD')}"`;
      }).join(',');
      deleteJobs.push(
        new Promise((resolve, reject) => {
          return queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(StockPriceEntity)
            .where(`stock_price_entity.code IN (${_codesToDelete})`)
            .andWhere(`stock_price_entity.date IN (${_datesToDelete})`)
            .execute()
            .then((res) => {
              resolve(res);
            })
            .catch((e) => {
              reject(e);
            });
        }),
      );
    });

    await Promise.all(deleteJobs);

    await queryRunner.manager.save(StockPriceEntity, stockPrices);

    const last = _.last(stockPrices);
    await queryRunner.manager.upsert(
      StockPriceSyncStatusEntity,
      {
        code,
        lastDate: last['date'],
      },
      ['code'],
    );

    // commit transaction now:
    await queryRunner.commitTransaction();
    syncSuccess = true;
  } catch (e) {
    syncSuccess = false;
    error = e;
    console.error(e);
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }

  return { syncSuccess, error };
};
