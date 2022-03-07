import { generateAction } from '@module/core/util/store/createAction';

const prefix = '$%FINANCE_INFO$%';

const START_GET_FINANCIAL_INDICATOR = 'START_GET_FINANCIAL_INDICATOR';
const startGetFinancialIndicator = generateAction<
  { termType: number; code: string },
  {
    data: any;
  }
>(START_GET_FINANCIAL_INDICATOR, prefix);

export const startGetFinanceInfoAction = startGetFinancialIndicator.ACTION;
export const startGetFinanceInfoAfterAction = startGetFinancialIndicator.AFTER;
export const startGetFinanceInfoErrorAction = startGetFinancialIndicator.ERROR;

const requestFinancialIndicator = generateAction<
  {
    code: string;
    page: number;
    lastYear?: number;
    lastQuarter?: number;
  },
  {
    data: any;
    code: string;
  }
>('REQUEST_FINANCIAL_INDICATOR', prefix);
export const requestFinancialIndicatorAction = requestFinancialIndicator.ACTION;
export const requestFinancialIndicatorAfterAction =
  requestFinancialIndicator.AFTER;
export const requestFinancialIndicatorErrorAction =
  requestFinancialIndicator.ERROR;

const saveFinancialIndicator = generateAction<
  any,
  {
    lastYear?: number;
    lastQuarter?: number;
  }
>('SAVE_FINANCE_INFO_PAGE', prefix);
export const saveFinanceInfoPageAfterAction = saveFinancialIndicator.AFTER;
export const saveFinanceInfoPageErrorAction = saveFinancialIndicator.ERROR;
