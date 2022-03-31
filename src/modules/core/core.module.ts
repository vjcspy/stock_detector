import { Module } from '@nestjs/common';
import { appInitAction } from '@module/core/store/actions';
import { CoreEffects } from '@module/core/store/effects';
import { StateManager } from '@module/core/provider/state-manager';
import { ConfigModule } from '@nestjs/config';
import rabbitmqCfg from '@cfg/rabbitmq.cfg';
import databaseCfg from '@cfg/database.cfg';
import { HttpModule } from '@nestjs/axios';
import { FileLogger } from '@module/core/provider/file-logger';
import { MongooseModule } from '@nestjs/mongoose';
import { LogDb, LogDbSchema } from '@module/core/schemas/log-db.schema';
import { LogService } from '@module/core/service/log.service';
import {
  JobResult,
  JobResultSchema,
} from '@module/core/schemas/job-result.schema';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CorValue } from '@module/finan-info/store/corporation/cor.value';
import { StockPriceValues } from '@module/finan-info/store/stock-price/stock-price.values';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';
import rabbitmq from '@cfg/rabbitmq.cfg';
import { FinanAnalysisQueueValue } from '@module/finan-analysis/values/finan-analysis-queue.value';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqCfg, databaseCfg],
    }),
    MongooseModule.forFeature([
      {
        name: LogDb.name,
        schema: LogDbSchema,
      },
      {
        name: JobResult.name,
        schema: JobResultSchema,
      },
    ]),
    HttpModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: CorValue.EXCHANGE_KEY,
          type: 'topic',
          options: {
            durable: true,
          },
        },
        {
          name: StockPriceValues.EXCHANGE_KEY,
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
        {
          name: FinanAnalysisQueueValue.EXCHANGE_COMPUTE,
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
        'nstock.channel-1': {
          prefetchCount: 1,
          default: true,
        },
      },
    }),
  ],
  providers: [StateManager, FileLogger, LogService, CoreEffects],
  exports: [
    StateManager,
    HttpModule,
    FileLogger,
    LogService,
    RabbitMQModule,
    MongooseModule,
  ],
})
export class CoreModule {
  constructor(
    protected stateManager: StateManager,
    protected coreEffects: CoreEffects,
  ) {
    this.stateManager.addFeatureEffect('core', coreEffects);
    this.stateManager.getStore().dispatch(appInitAction.ACTION());
  }
}
