import { createReducer } from '@reduxjs/toolkit';
import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';
import {
  requestFinancialInfoAction,
  startGetFinanceInfoAction,
} from '@module/finan-info/store/financial-info/financial-info.actions';

export interface FinancialInfo {
  code?: string;
  lastYear?: number;
  lastQuarter?: number;
  page?: number;
  termType?: FinancialTermTypeEnum;
  type?: FinancialInfoType;
  resolve?: any;
  reject?: any;
}

export interface FinancialInfosState {
  infos: FinancialInfo[];
}

const FinanceInfoReducerFactory = (): FinancialInfosState => ({
  infos: [],
});

export const financialInfoReducer = createReducer(
  FinanceInfoReducerFactory(),
  (builder) => {
    builder
      .addCase(startGetFinanceInfoAction, (state, action) => {
        const info = state.infos.find(
          (_if) =>
            _if.code === action.payload.code &&
            _if.termType === action.payload.termType &&
            _if.type === action.payload.type,
        );

        if (info) {
          delete info['page'];
          delete info['lastQuarter'];
          delete info['lastYear'];
          delete info['reject'];
          delete info['resolve'];
        } else {
          state.infos.push({
            code: action.payload.code,
            type: action.payload.type,
            termType: action.payload.termType,
            resolve: action.payload.resolve,
            reject: action.payload.reject,
          });
        }
      })
      .addCase(requestFinancialInfoAction, (state, action) => {
        const info = state.infos.find(
          (_if) =>
            _if.code === action.payload.code &&
            _if.termType === action.payload.termType &&
            _if.type === action.payload.type,
        );
        info.page = action.payload.page;
        info.lastYear = action.payload.lastYear;
        info.lastQuarter = action.payload.lastQuarter;
      });
  },
);
