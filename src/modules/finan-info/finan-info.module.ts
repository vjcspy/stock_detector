import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CoreModule } from '@module/core/core.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorEntity } from './entity/cor.entity';
import rabbitmq from '@cfg/rabbitmq.cfg';
import { CorController } from './controller/cor.controller';
import { PriceController } from '@module/finan-info/controller/price.controller';
import { QUEUE_PROVIDES } from '@module/finan-info/queue';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stock-price-sync-status.entity';
import { FINANCIAL_PROVIDERS } from '@module/finan-info/provider/state';
import { CorporationState } from '@module/finan-info/provider/state/corporation.state';
import { StockPriceState } from '@module/finan-info/provider/state/stock-price.state';
import { FinancialIndicatorState } from '@module/finan-info/provider/state/financial-indicator.state';
import { StateEffects } from '@module/finan-info/store';
import { FinancialInfoStatusEntity } from '@module/finan-info/entity/financial-info-status.entity';
import { FinancialInfoController } from '@module/finan-info/controller/financial-info.controller';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorEntity,
      FinancialIndicatorsEntity,
      FinancialInfoStatusEntity,
      StockPriceEntity,
      StockPriceSyncStatusEntity,
    ]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'finan.info.cor',
          type: 'topic',
          options: {
            durable: true,
          },
        },
        {
          name: 'finan.info.sync-stock-price',
          type: 'topic',
          options: {
            durable: true,
          },
        },
        {
          name: FinancialInfoValues.EXCHANGE_KEY,
          type: 'topic',
          options: {
            durable: true,
          },
        },
      ],
      uri: `amqp://${rabbitmq().user}:${rabbitmq().pass}@${rabbitmq().host}:${
        rabbitmq().port
      }`,
      channels: {
        'finan.info.channel-1': {
          prefetchCount: 1,
          default: true,
        },
      },
    }),
    CoreModule,
  ],
  controllers: [CorController, PriceController, FinancialInfoController],
  providers: [...QUEUE_PROVIDES, ...FINANCIAL_PROVIDERS, ...StateEffects],
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
