import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanInfoModule } from '@module/finan-info/finan-info.module';
import { CoreModule } from '@module/core/core.module';
import { ConfigService } from '@nestjs/config';
import databaseCfg from '@cfg/database.cfg';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { FinanAnalysisModule } from './modules/finan-analysis/finan-analysis.module';
import mongoCfg from '@cfg/mongo.cfg';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { StockPriceValues } from '@module/finan-info/store/stock-price/stock-price.values';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';
import rabbitmq from '@cfg/rabbitmq.cfg';
import { CorValue } from '@module/finan-info/store/corporation/cor.value';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: databaseCfg().host,
      port: databaseCfg().port,
      username: databaseCfg().user,
      password: databaseCfg().pass,
      database: 'nstock',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${mongoCfg().user}:${mongoCfg().pass}@${mongoCfg().host}:${
        mongoCfg().port
      }`,
      {
        dbName: 'nstocklog',
      },
    ),
    CoreModule,
    FinanInfoModule,
    FinanAnalysisModule,

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger('Application');
  constructor(private configService: ConfigService) {
    this.logger.log('App version: ', this.configService.get('APP_VERSION'));
  }
}
