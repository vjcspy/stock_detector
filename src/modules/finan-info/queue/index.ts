import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';
import { SyncStockPriceConsumer } from '@module/finan-info/queue/consumer/SyncStockPrice.consumer';
import { SyncFinancialIndicatorPublisher } from '@module/finan-info/queue/publisher/SyncFinancialIndicator.publisher';
import { SyncFinancialIndicatorYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorYear.consumer';

export const QUEUE_PROVIDES = [
  SyncStockPricePublisher,
  SyncStockPriceConsumer,
  SyncFinancialIndicatorPublisher,
  SyncFinancialIndicatorYearConsumer,
];
