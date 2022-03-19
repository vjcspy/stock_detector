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
import { LogDbService } from '@module/core/service/log-db.service';

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
    ]),
    HttpModule,
  ],
  providers: [StateManager, FileLogger, LogDbService, CoreEffects],
  exports: [StateManager, HttpModule, FileLogger],
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
