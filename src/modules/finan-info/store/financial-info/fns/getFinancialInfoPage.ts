import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';
import { retrieveFinanceIndicator } from '@module/finan-info/requests/vietstock/financeIndicator';

export const getFinancialInfoPage = async (
  code: string,
  type: FinancialInfoType,
  termType: FinancialTermTypeEnum,
  page: number,
) => {
  switch (type) {
    case FinancialInfoType.INDICATOR:
      return await retrieveFinanceIndicator(code, termType, page);

    default:
      throw new Error('Unknown type');
  }
};
