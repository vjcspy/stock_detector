import { SyncCorEffects } from '@module/finan-info/store/corporation/sync-cor.effects';
import { StockPriceEffects } from './stock-price/stock-price.effects';
import { FinancialIndicatorEffects } from '@module/finan-info/store/financial-indicator/financial-indicator.effects';

export const StateEffects = [
  SyncCorEffects,
  StockPriceEffects,
  FinancialIndicatorEffects,
];
