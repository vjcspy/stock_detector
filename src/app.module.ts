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
import { FinanAnalysisModule } from '@module/finan-analysis/finan-analysis.module';
import mongoCfg from '@cfg/mongo.cfg';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: databaseCfg().defaultDatabase.host,
      port: databaseCfg().defaultDatabase.port,
      username: databaseCfg().defaultDatabase.user,
      password: databaseCfg().defaultDatabase.pass,
      database: 'nstock',
      autoLoadEntities: true,
      synchronize: false,
    }),
    MongooseModule.forRoot(
      `mongodb://${mongoCfg().mongodb.user}:${mongoCfg().mongodb.pass}@${
        mongoCfg().mongodb.host
      }:${mongoCfg().mongodb.port}/nstock`,
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
    this.logger.log(
      `[${process.env.INSTANCE_ID}]App version: ${this.configService.get(
        'APP_VERSION',
      )}, Running on PORT: ${this.configService.get('PORT')}`,
    );
  }
}
