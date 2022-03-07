import { Injectable } from '@nestjs/common';
import { syncCorReducer } from '@module/finan-info/store/corporation/sync-cor.reducer';
import { syncCorEffects } from '@module/finan-info/store/corporation/sync-cor.effects';
import { StateManager } from '@module/core/provider/state-manager';

@Injectable()
export class CorporationState {
  protected _init = false;
  constructor(protected stateManager: StateManager) {}
  public config() {
    if (this._init) {
      return;
    }
    const storeManager = this.stateManager.getStoreManager();
    storeManager.mergeReducers({
      syncCor: syncCorReducer,
    });

    storeManager.addEpics('sync-cor', [...syncCorEffects]);
    this._init = true;
  }
}
