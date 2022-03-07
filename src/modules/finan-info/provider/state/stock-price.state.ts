import { Injectable } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { stockPriceReducer } from '@module/finan-info/store/stock-price/stock-price.reducer';
import { stockPriceEffects } from '@module/finan-info/store/stock-price/stock-price.effects';

@Injectable()
export class StockPriceState {
  protected _init = false;
  constructor(protected stateManager: StateManager) {}
  public config() {
    if (this._init) {
      return;
    }
    const storeManager = this.stateManager.getStoreManager();
    storeManager.mergeReducers({
      stockPrices: stockPriceReducer,
    });

    storeManager.addEpics('sync-stock-price', [...stockPriceEffects]);
    this._init = true;
  }
}
