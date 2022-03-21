import { generateAction } from '@module/core/util/store/createAction';
import { FinancialInfoType } from '@module/finan-info/entity/financial-info-status.entity';

const prefix = '$%FINANCE_INFO$%';

const GET_FINANCIAL_INFO = 'GET_FINANCIAL_INFO';
const getFinancialIndicator = generateAction<
  { code: string; termType: number; type: FinancialInfoType },
  any
>(GET_FINANCIAL_INFO, prefix);

export const startGetFinanceInfoAction = getFinancialIndicator.ACTION;
export const finishGetFinanceInfoAfterAction = getFinancialIndicator.AFTER;
export const getFinanceInfoErrorAction = getFinancialIndicator.ERROR;

const requestFinancialInfo = generateAction<
  {
    code: string;
    termType: number;
    type: FinancialInfoType;
    page: number;
    lastYear?: number;
    lastQuarter?: number;
  },
  {
    data: any;
    code: string;
    termType: number;
    type: FinancialInfoType;
  }
>('REQUEST_FINANCIAL_INFO', prefix);
export const requestFinancialInfoAction = requestFinancialInfo.ACTION;
export const requestFinancialInfoAfterAction = requestFinancialInfo.AFTER;
export const requestFinancialInfoErrorAction = requestFinancialInfo.ERROR;

const saveFinancialInfo = generateAction<
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  {
    code: string;
    termType: number;
    type: FinancialInfoType;
    lastYear?: number;
    lastQuarter?: number;
  },
  {
    code: string;
    termType: number;
    type: FinancialInfoType;
    error: any;
  }
>('SAVE_FINANCE_INFO_PAGE', prefix);
export const saveFinanceInfoPageAfterAction = saveFinancialInfo.AFTER;
export const saveFinanceInfoPageErrorAction = saveFinancialInfo.ERROR;
