import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import { FinancialInfoStatusEntity } from '@module/finan-info/entity/financial-info-status.entity';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stock-price-sync-status.entity';
import { FinancialBalanceSheetEntity } from '@module/finan-info/entity/financial-balance-sheet.entity';
import { FinancialCashFlowEntity } from '@module/finan-info/entity/financial-cash-flow.entity';
import { FinancialBusinessReportEntity } from '@module/finan-info/entity/financial-business-report.entity';

export const ENTITIES = [
  CorEntity,

  FinancialIndicatorsEntity,
  FinancialBalanceSheetEntity,
  FinancialCashFlowEntity,
  FinancialBusinessReportEntity,
  FinancialInfoStatusEntity,

  StockPriceEntity,
  StockPriceSyncStatusEntity,
];
