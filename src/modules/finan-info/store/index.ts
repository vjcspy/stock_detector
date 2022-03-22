import { SyncCorEffects } from '@module/finan-info/store/corporation/sync-cor.effects';
import { StockPriceEffects } from './stock-price/stock-price.effects';
import { FinancialInfoEffects } from '@module/finan-info/store/financial-info/financial-info.effects';

export const StateEffects = [
  SyncCorEffects,
  StockPriceEffects,
  FinancialInfoEffects,
];
