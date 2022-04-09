import { SyncCorEffects } from '@module/finan-info/store/corporation/sync-cor.effects';
import { StockPriceEffects } from './stock-price/stock-price.effects';
import { FinancialInfoEffects } from '@module/finan-info/store/financial-info/financial-info.effects';
import { SyncOrderMatchingEffects } from '@module/finan-info/store/order-matching/order-matching.effects';

export const StateEffects = [
  SyncCorEffects,
  StockPriceEffects,
  FinancialInfoEffects,
  SyncOrderMatchingEffects,
];
