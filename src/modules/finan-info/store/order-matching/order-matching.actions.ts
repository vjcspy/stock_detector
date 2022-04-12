import { generateAction } from '@module/core/util/store/createAction';
import { OrderMatchingType } from '@module/finan-info/schema/order-matching.schema';

const PREFIX = 'SYNC_ORDER_MATCHING';
export const syncOrderMatching = generateAction<
  {
    code: string;
    type: OrderMatchingType;
    resolve?: any;
    force?: boolean;
  },
  { code: string; type: OrderMatchingType },
  { code: string; type: OrderMatchingType; error: any }
>('SYNC_ORDER_MATCHING', PREFIX);

export const requestOrderMatchingPage = generateAction<
  {
    code: string;
    type: OrderMatchingType;
    page?: number;
  },
  {
    code: string;
    type: OrderMatchingType;
    page: number;
    data: any;
  },
  {
    code: string;
    type: OrderMatchingType;
    page: number;
    error: any;
  }
>('REQUEST_ORDER_MATCHING_PAGE', PREFIX);

export const saveOrderMatchingPage = generateAction<
  unknown,
  {
    code: string;
    type: OrderMatchingType;
    page: number;
  },
  {
    code: string;
    type: OrderMatchingType;
    page: number;
  }
>('SAVE_ORDER_MATCHING_PAGE', PREFIX);
