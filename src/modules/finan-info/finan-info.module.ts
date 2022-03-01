import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorEntity } from './entity/cor.entity';
import { FinancialIndicatorsEntity } from './entity/financialIndicators.entity';
import { FinancialIndicatorStatusEntity } from './entity/financialIndicatorStatus.entity';
import { StockPriceEntity } from './entity/stockPrice.entity';
import { StockPriceSyncStatusEntity } from './entity/stockPriceSyncStatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorEntity,
      FinancialIndicatorsEntity,
      FinancialIndicatorStatusEntity,
      StockPriceEntity,
      StockPriceSyncStatusEntity,
    ]),
  ],
})
export class FinanInfoModule {}
