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
import { FinancialIndicatorStatusEntity } from '@module/finan-info/entity/financial-indicatorStatus.entity';
import { FINANCIAL_PROVIDERS } from '@module/finan-info/provider/state';
import { CorporationState } from '@module/finan-info/provider/state/corporation.state';
import { StockPriceState } from '@module/finan-info/provider/state/stock-price.state';
import { FinancialIndicatorState } from '@module/finan-info/provider/state/financial-indicator.state';
import { FinancialIndicatorController } from '@module/finan-info/controller/financial-indicator.controller';
import { SyncFinancialIndicatorPublisher } from '@module/finan-info/queue/publisher/SyncFinancialIndicator.publisher';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorEntity,
      FinancialIndicatorsEntity,
      FinancialIndicatorStatusEntity,
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
          name: SyncFinancialIndicatorPublisher.EXCHANGE,
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
  controllers: [CorController, PriceController, FinancialIndicatorController],
  providers: [...QUEUE_PROVIDES, ...FINANCIAL_PROVIDERS],
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
