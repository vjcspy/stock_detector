import { StockPriceState } from '@module/finan-info/provider/state/stock-price.state';
import { CorporationState } from '@module/finan-info/provider/state/corporation.state';
import { FinancialIndicatorState } from '@module/finan-info/provider/state/financial-indicator.state';

export const FINANCIAL_PROVIDERS = [
  CorporationState,
  FinancialIndicatorState,
  StockPriceState,
];
