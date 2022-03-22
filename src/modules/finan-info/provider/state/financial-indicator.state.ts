import { Injectable } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { FinancialInfoEffects } from '@module/finan-info/store/financial-info/financial-info.effects';
import { financialInfoReducer } from '@module/finan-info/store/financial-info/financial-info.reducer';

@Injectable()
export class FinancialIndicatorState {
  protected _init = false;
  constructor(
    protected stateManager: StateManager,
    private fiEffects: FinancialInfoEffects,
  ) {}
  public config() {
    if (this._init) {
      return;
    }
    const storeManager = this.stateManager.getStoreManager();
    storeManager.mergeReducers({
      financialInfo: financialInfoReducer,
    });

    this.stateManager.addFeatureEffect(
      'sync-financial-indicator',
      this.fiEffects,
    );
    this._init = true;
  }
}
