import { CoreModule } from '@module/core/core.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorController } from './controller/cor.controller';
import { PriceController } from '@module/finan-info/controller/price.controller';
import { QUEUE_PROVIDES } from '@module/finan-info/queue';
import { FINANCIAL_PROVIDERS } from '@module/finan-info/provider/state';
import { CorporationState } from '@module/finan-info/provider/state/corporation.state';
import { StockPriceState } from '@module/finan-info/provider/state/stock-price.state';
import { FinancialIndicatorState } from '@module/finan-info/provider/state/financial-indicator.state';
import { StateEffects } from '@module/finan-info/store';
import { FinancialInfoController } from '@module/finan-info/controller/financial-info.controller';
import { ENTITIES } from '@module/finan-info/entity';
import { FI_JOBS } from '@module/finan-info/job';
import { OrderMatchingStateDeclaration } from '@module/finan-info/provider/state/order-matching.state';
import { FINAN_INFO_SERVICES } from '@module/finan-info/service';
import { OrderMatchingController } from '@module/finan-info/controller/order-matching.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobSyncStatus,
  JobSyncStatusSchema,
} from '@module/finan-info/schema/job-sync-status.schema';
import {
  OrderMatching,
  OrderMatchingSchema,
} from '@module/finan-info/schema/order-matching.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([...ENTITIES]),
    CoreModule,
    MongooseModule.forFeature([
      {
        name: JobSyncStatus.name,
        schema: JobSyncStatusSchema,
      },
      {
        name: OrderMatching.name,
        schema: OrderMatchingSchema,
      },
    ]),
  ],
  controllers: [
    CorController,
    PriceController,
    FinancialInfoController,
    OrderMatchingController,
  ],
  providers: [
    ...QUEUE_PROVIDES,
    ...FINANCIAL_PROVIDERS,
    ...StateEffects,
    ...FI_JOBS,
    ...FINAN_INFO_SERVICES,
  ],
  exports: [TypeOrmModule, MongooseModule],
})
export class FinanInfoModule {
  constructor(
    private corporationState: CorporationState,
    private stockPriceState: StockPriceState,
    private financialIndicatorState: FinancialIndicatorState,
    private orderMatchingStateDeclaration: OrderMatchingStateDeclaration,
  ) {
    this.corporationState.config();
    this.stockPriceState.config();
    this.financialIndicatorState.config();
    this.orderMatchingStateDeclaration.config();
  }
}
