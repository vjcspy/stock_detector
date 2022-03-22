import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';
import { retrieveFinanceIndicator } from '@module/finan-info/requests/vietstock/financeIndicator';
import { retrieveFinanceIBusinessReport } from '@module/finan-info/requests/vietstock/financeIBusinessReport';
import { retrieveCashFlow } from '@module/finan-info/requests/vietstock/financeICashFlow';
import { retrieveBalanceSheet } from '@module/finan-info/requests/vietstock/financeIBalanceSheet';

export const getFinancialInfoPage = async (
  code: string,
  type: FinancialInfoType,
  termType: FinancialTermTypeEnum,
  page: number,
) => {
  switch (type) {
    case FinancialInfoType.INDICATOR:
      return await retrieveFinanceIndicator(code, termType, page);

    case FinancialInfoType.BUSINESS_REPORT:
      return await retrieveFinanceIBusinessReport(code, termType, page);

    case FinancialInfoType.CASH_FLOW:
      return await retrieveCashFlow(code, termType, page);

    case FinancialInfoType.BALANCE_SHEET:
      return await retrieveBalanceSheet(code, termType, page);

    default:
      throw new Error('Unknown type');
  }
};
