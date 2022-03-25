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

@Module({
  imports: [TypeOrmModule.forFeature([...ENTITIES]), CoreModule],
  controllers: [CorController, PriceController, FinancialInfoController],
  providers: [
    ...QUEUE_PROVIDES,
    ...FINANCIAL_PROVIDERS,
    ...StateEffects,
    ...FI_JOBS,
  ],
})
export class FinanInfoModule {
  constructor(
    private corporationState: CorporationState,
    private stockPriceState: StockPriceState,
    private financialIndicatorState: FinancialIndicatorState,
  ) {
    this.corporationState.config();
    this.stockPriceState.config();
    this.financialIndicatorState.config();
  }
}
