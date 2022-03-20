import { Injectable } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { stockPriceReducer } from '@module/finan-info/store/stock-price/stock-price.reducer';
import { StockPriceEffects } from '@module/finan-info/store/stock-price/stock-price.effects';

@Injectable()
export class StockPriceState {
  protected _init = false;
  constructor(
    protected stateManager: StateManager,
    private syncStockPriceEffects: StockPriceEffects,
  ) {}
  public config() {
    if (this._init) {
      return;
    }
    const storeManager = this.stateManager.getStoreManager();
    storeManager.mergeReducers({
      stockPrices: stockPriceReducer,
    });
    this.stateManager.addFeatureEffect(
      'sync-stock-price',
      this.syncStockPriceEffects,
    );
    this._init = true;
  }
}
