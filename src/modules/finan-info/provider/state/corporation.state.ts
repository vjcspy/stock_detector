import { Injectable } from '@nestjs/common';
import { syncCorReducer } from '@module/finan-info/store/corporation/sync-cor.reducer';
import { SyncCorEffects } from '@module/finan-info/store/corporation/sync-cor.effects';
import { StateManager } from '@module/core/provider/state-manager';

@Injectable()
export class CorporationState {
  protected _init = false;
  constructor(
    protected stateManager: StateManager,
    protected syncCorEffects: SyncCorEffects,
  ) {}
  public config() {
    if (this._init) {
      return;
    }
    const storeManager = this.stateManager.getStoreManager();
    storeManager.mergeReducers({
      syncCor: syncCorReducer,
    });

    this.stateManager.addFeatureEffect('sync-cor', this.syncCorEffects);

    this._init = true;
  }
}
