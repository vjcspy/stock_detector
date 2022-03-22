import { createAction } from '@reduxjs/toolkit';
import * as moment from 'moment';
import { generateAction } from '@module/core/util/store/createAction';
import { Moment } from 'moment';

const STOCK_PRICES_START = 'STOCK_PRICES_START';
export const stockPricesStartAction = createAction<{
  code: string;
  resolve: any;
  reject: any;
}>(STOCK_PRICES_START);

const GET_STOCK_PRICES = 'GET_STOCK_PRICES';
const getStockPrices = generateAction<
  { code: string; lastDate: moment.Moment; endDate: Moment },
  {
    data: any;
    code: string;
  }
>(GET_STOCK_PRICES);

export const getStockPricesAction = getStockPrices.ACTION;
export const getStockPricesAfterAction = getStockPrices.AFTER;
export const getStockPricesErrorAction = getStockPrices.ERROR;

const SAVE_STOCK_PRICES = 'SAVE_STOCK_PRICES';
const saveStockPrice = generateAction<
  Record<string, any>,
  {
    code: string;
  }
>(SAVE_STOCK_PRICES);

export const saveStockPriceAfterAction = saveStockPrice.AFTER;
export const saveStockPriceErrorAction = saveStockPrice.ERROR;

const STOCK_PRICES_FINISHED = 'STOCK_PRICES_FINISHED';
export const stockPricesFinishedAction = createAction<{
  code: string;
}>(STOCK_PRICES_FINISHED);
