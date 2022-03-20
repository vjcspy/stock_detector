import { Injectable } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { financialIndicatorReducer } from '@module/finan-info/store/financial-indicator/financial-indicator.reducer';
import { FinancialIndicatorEffects } from '@module/finan-info/store/financial-indicator/financial-indicator.effects';

@Injectable()
export class FinancialIndicatorState {
  protected _init = false;
  constructor(
    protected stateManager: StateManager,
    private fiEffects: FinancialIndicatorEffects,
  ) {}
  public config() {
    if (this._init) {
      return;
    }
    const storeManager = this.stateManager.getStoreManager();
    storeManager.mergeReducers({
      financialIndicator: financialIndicatorReducer,
    });

    this.stateManager.addFeatureEffect(
      'sync-financial-indicator',
      this.fiEffects,
    );
    this._init = true;
  }
}
