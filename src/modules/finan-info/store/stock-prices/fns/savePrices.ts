import { getConnection } from 'typeorm';
import { StockPriceEntity } from '@module/finan-info/entity/stockPrice.entity';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stockPriceSyncStatus.entity';
import * as _ from 'lodash';

export const savePrices = async (code: string, priceData: any) => {
  let syncSuccess: any = false;

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  try {
    // establish real database connection using our new query runner
    await queryRunner.connect();

    // lets now open a new transaction:
    await queryRunner.startTransaction();
    const stockPrices = _.map(priceData.items, (p) => {
      const _p: any = { ...p };
      _p['date'] = new Date(p['Date']);
      return _p;
    });
    const last = _.last(stockPrices);
    await queryRunner.manager.save(StockPriceEntity, stockPrices);
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
    console.log('sync success code: ' + code + ' year: ' + last.date);
    syncSuccess = true;
  } catch (e) {
    syncSuccess = e;
    console.error(e);
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }

  return syncSuccess;
};

