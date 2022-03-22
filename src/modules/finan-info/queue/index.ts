import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';
import { SyncStockPriceConsumer } from '@module/finan-info/queue/consumer/SyncStockPrice.consumer';
import { SyncFinancialIndicatorYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorYear.consumer';
import { SyncFinancialInfoPublisher } from '@module/finan-info/queue/publisher/SyncFinancialInfo.publisher';

export const QUEUE_PROVIDES = [
  /* Sync price*/
  SyncStockPricePublisher,
  SyncStockPriceConsumer,

  /* Sync financial info*/
  SyncFinancialInfoPublisher,
  SyncFinancialIndicatorYearConsumer,
];
