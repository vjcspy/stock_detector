import { StockPriceState } from '@module/finan-info/provider/state/stock-price.state';
import { CorporationState } from '@module/finan-info/provider/state/corporation.state';
import { FinancialIndicatorState } from '@module/finan-info/provider/state/financial-indicator.state';
import { OrderMatchingStateDeclaration } from '@module/finan-info/provider/state/order-matching.state';

export const FINANCIAL_PROVIDERS = [
  CorporationState,
  FinancialIndicatorState,
  StockPriceState,
  OrderMatchingStateDeclaration,
];
