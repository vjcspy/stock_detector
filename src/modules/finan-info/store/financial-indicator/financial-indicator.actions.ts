import { generateAction } from '@module/core/util/store/createAction';

const prefix = '$%FINANCE_INFO$%';

const GET_FINANCIAL_INDICATOR = 'GET_FINANCIAL_INDICATOR';
const getFinancialIndicator = generateAction<
  { termType: number; code: string },
  any
>(GET_FINANCIAL_INDICATOR, prefix);

export const startGetFinanceInfoAction = getFinancialIndicator.ACTION;
export const finishGetFinanceInfoAfterAction = getFinancialIndicator.AFTER;
export const getFinanceInfoErrorAction = getFinancialIndicator.ERROR;

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
