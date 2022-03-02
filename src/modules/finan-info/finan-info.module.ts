import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CoreModule } from '@module/core/core.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorEntity } from './entity/cor.entity';
import { FinancialIndicatorsEntity } from './entity/financialIndicators.entity';
import { FinancialIndicatorStatusEntity } from './entity/financialIndicatorStatus.entity';
import { StockPriceEntity } from './entity/stockPrice.entity';
import { StockPriceSyncStatusEntity } from './entity/stockPriceSyncStatus.entity';
import { CorporationState } from '@module/finan-info/provider/corporation.state';
import rabbitmq from '@cfg/rabbitmq.cfg';
import { CorController } from './controller/cor.controller';

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
  controllers: [CorController],
  providers: [CorporationState],
})
export class FinanInfoModule {
  constructor(protected corporationState: CorporationState) {
    this.corporationState.config();
  }
}
