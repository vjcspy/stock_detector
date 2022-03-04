import { createReducer } from '@reduxjs/toolkit';
import * as moment from 'moment';

import { getStockPricesAction } from './stock-prices.actions';

export interface StockPriceState {
  lastDate?: moment.Moment;
  endDate?: moment.Moment;
}

export const stockPriceStateFactory = (): StockPriceState => ({});

export const stockPriceReducer = createReducer(
  stockPriceStateFactory(),
  (builder) => {
    builder.addCase(getStockPricesAction, (state, action) => {
      state.lastDate = action.payload.lastDate;
      state.endDate = action.payload.endDate;
    });
  },
);
