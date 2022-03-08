import { createReducer } from '@reduxjs/toolkit';
import {
  requestFinancialIndicatorAction,
  saveFinanceInfoPageAfterAction,
  startGetFinanceInfoAction,
} from '@module/finan-info/store/financial-indicator/financial-indicator.actions';

export enum FinancialTermTypeEnum {
  YEAR = 1,
  QUARTER = 2,
}
export interface FinancialIndicatorState {
  code?: string;
  lastYear?: number;
  lastQuarter?: number;
  page?: number;
  termType: FinancialTermTypeEnum;
}

const FinanceInfoReducerFactory = (): FinancialIndicatorState => ({
  termType: FinancialTermTypeEnum.YEAR,
});

export const financialIndicatorReducer = createReducer(
  FinanceInfoReducerFactory(),
  (builder) => {
    builder
      .addCase(startGetFinanceInfoAction, (state, action) => {
        state.code = action.payload.code;
        state.termType = action.payload.termType;
      })
      .addCase(requestFinancialIndicatorAction, (state, action) => {
        state.page = action.payload.page;
        state.lastYear = action.payload.lastYear;
        state.lastQuarter = action.payload.lastQuarter;
      });
  },
);
