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

console.log(
  `mongodb://${mongoCfg().user}:${mongoCfg().pass}@${mongoCfg().host}:${
    mongoCfg().port
  }`,
);
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
        dbName: 'nstock',
      },
    ),
    CoreModule,
    FinanInfoModule,
    FinanAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger('Application');
  constructor(private configService: ConfigService) {
    this.logger.log('App version: ', this.configService.get('APP_VERSION'));
    this.logger.log(
      'mongourl: ',
      `mongodb://${mongoCfg().user}:${mongoCfg().pass}@${mongoCfg().host}:${
        mongoCfg().port
      }`,
    );
  }
}
