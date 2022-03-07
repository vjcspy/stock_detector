import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CoreModule } from '@module/core/core.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorEntity } from './entity/cor.entity';
import { CorporationState } from '@module/finan-info/provider/corporation.state';
import rabbitmq from '@cfg/rabbitmq.cfg';
import { CorController } from './controller/cor.controller';
import { StockPriceRequest } from '@module/finan-info/requests/bsc/price.request';
import { PriceController } from '@module/finan-info/controller/price.controller';
import { StockPriceState } from '@module/finan-info/provider/stock-price.state';
import { QUEUE_PROVIDES } from '@module/finan-info/queue';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stock-price-sync-status.entity';
import { FinancialIndicatorStatusEntity } from '@module/finan-info/entity/financial-indicatorStatus.entity';

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
  controllers: [CorController, PriceController],
  providers: [
    CorporationState,
    StockPriceRequest,
    StockPriceState,
    ...QUEUE_PROVIDES,
  ],
})
export class FinanInfoModule {
  constructor(
    protected corporationState: CorporationState,
    protected stockPriceState: StockPriceState,
  ) {
    this.corporationState.config();
    this.stockPriceState.config();
  }
}
