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
  ],
  providers: [StateManager, FileLogger, LogService, CoreEffects],
  exports: [StateManager, HttpModule, FileLogger, LogService],
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
