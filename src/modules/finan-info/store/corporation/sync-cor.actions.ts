import { VietStockCredentialsInterface } from '@module/finan-info/requests/vietstock/credentials';
import {
  createAction,
  generateAction,
} from '@module/core/util/store/createAction';

const PREFIX = 'SYNC_COR';

const START_SYNC_COR = 'START_SYNC_COR';
export const startSyncCor = createAction(START_SYNC_COR, PREFIX);

const corGetNextPage = generateAction<
  { vsCreds?: VietStockCredentialsInterface },
  {
    page: number;
    numOfRecords: number;
    runNextPage?: boolean;
  }
>('corGetNextPage');
export const corGetNextPageAction = corGetNextPage.ACTION;
export const corGetNextPageAfterAction = corGetNextPage.AFTER;
export const corGetNextPageErrorAction = corGetNextPage.ERROR;

const FINISH_SYNC_COR = 'FINISH_SYNC_COR';
export const finishSyncCor = createAction(FINISH_SYNC_COR, PREFIX);
