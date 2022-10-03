import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { DataSource } from 'typeorm';
import * as _ from 'lodash';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stock-price-sync-status.entity';

@Injectable()
export class StockPriceService {
  static get repo() {
    return this._repo ?? StockPriceEntity.getRepository();
  }
  private static _repo: Repository<StockPriceEntity>;

  constructor(private dataSource: DataSource) {}

  public async savePrices(code: string, priceData: { items: any[] }) {
    let syncSuccess: any = false;
    let error: any = undefined;

    const queryRunner = this.dataSource.createQueryRunner();
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

      await queryRunner.manager.upsert(StockPriceEntity, stockPrices, {
        conflictPaths: ['code', 'date', 'id'],
        // Make sure re-update trong trường hợp update cùng ngày
        skipUpdateIfNoValuesChanged: false,
      });

      const last = _.last(stockPrices);
      // await queryRunner.manager
      //   .createQueryBuilder()
      //   .insert()
      //   .into(StockPriceEntity)
      //   .values(stockPrices)
      //   .orUpdate(Object.keys(last), ['code', 'date'])
      //   .orUpdate({
      //     conflict_target: ['code'],
      //     overwrite: ['name', 'parentId', 'web', 'avatar', 'description'],
      //   })
      //   .execute();

      await queryRunner.manager.upsert(
        StockPriceSyncStatusEntity,
        {
          code,
          lastDate: last['date'],
          lastUpdateDate: new Date(),
          try: 0,
          lastError: null,
        },
        ['code'],
      );

      // commit transaction now:
      await queryRunner.commitTransaction();
      syncSuccess = true;
    } catch (e) {
      syncSuccess = false;
      error = e;
      console.error(e?.toString ? e.toString() : e);
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }

    return { syncSuccess, error };
  }
}
