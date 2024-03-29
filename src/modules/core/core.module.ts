import { Logger, Module } from '@nestjs/common';
import { appInitAction } from '@module/core/store/actions';
import { CoreEffects } from '@module/core/store/effects';
import { StateManager } from '@module/core/provider/state-manager';
import { ConfigModule } from '@nestjs/config';
import rabbitmqCfg from '@cfg/rabbitmq.cfg';
import databaseCfg from '@cfg/database.cfg';
import { HttpModule } from '@nestjs/axios';
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
import { CORE_SERVICES } from '@module/core/service';
import slackCfg from '@cfg/slack.cfg';
import { SlackService } from '@module/core/service/slack.service';
import {
  CronSchedule,
  CronScheduleSchema,
} from '@module/core/schemas/cron-schedule.schema';
import { HealthController } from './controller/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.production',
        '.env.development.local',
        '.env.development',
        '.env',
      ],
      load: [rabbitmqCfg, databaseCfg, slackCfg],
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
      {
        name: CronSchedule.name,
        schema: CronScheduleSchema,
      },
    ]),
    HttpModule,

    // TODO: phải config ở các module khác, chứ không phải ở core =))
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
      uri: `amqp://${rabbitmq().rabbitmq.user}:${rabbitmq().rabbitmq.pass}@${
        rabbitmq().rabbitmq.host
      }:${rabbitmq().rabbitmq.port}`,
      channels: {
        'nstock.channel-1': {
          prefetchCount: 1,
          default: true,
        },
      },
    }),
  ],
  providers: [...CORE_SERVICES, StateManager, CoreEffects, Logger],
  exports: [
    StateManager,
    HttpModule,
    LogService,
    RabbitMQModule,
    MongooseModule,
    Logger,
    ...CORE_SERVICES,
  ],
  controllers: [HealthController],
})
export class CoreModule {
  constructor(
    protected stateManager: StateManager,
    protected coreEffects: CoreEffects,
    protected slackService: SlackService,
  ) {
    this.stateManager.addFeatureEffect('core', coreEffects);
  }

  onModuleInit() {
    this.stateManager.getStore().dispatch(appInitAction.ACTION());
    this.slackService.registerChannels();
  }
}
