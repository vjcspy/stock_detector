import { createReducer } from '@reduxjs/toolkit';
import * as moment from 'moment';
import {
  getStockPricesAction,
  stockPricesStartAction,
} from '@module/finan-info/store/stock-price/stock-price.actions';

export interface StockPriceState {
  lastDate?: moment.Moment;
  endDate?: moment.Moment;
  resolve?: any;
}

export const stockPriceStateFactory = (): StockPriceState => ({});

export const stockPriceReducer = createReducer(
  stockPriceStateFactory(),
  (builder) => {
    builder
      .addCase(stockPricesStartAction, (state, action) => {
        state.resolve = action.payload.resolve;
      })
      .addCase(getStockPricesAction, (state, action) => {
        state.lastDate = action.payload.lastDate;
        state.endDate = action.payload.endDate;
      });
  },
);
