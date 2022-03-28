import { StateManager } from '@module/core/provider/state-manager';
import { Controller, Get } from '@nestjs/common';
import { startSyncCor } from '../store/corporation/sync-cor.actions';

@Controller('cor')
export class CorController {
  constructor(protected stateManager: StateManager) {}

  @Get('/sync')
  sync(): string {
    this.stateManager.getStore().dispatch(startSyncCor());
    return 'ok';
  }
}
