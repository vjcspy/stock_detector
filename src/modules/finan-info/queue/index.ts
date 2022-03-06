import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';
import { SyncStockPriceConsumer } from '@module/finan-info/queue/consumer/SyncStockPrice.consumer';

export const QUEUE_PROVIDES = [SyncStockPricePublisher, SyncStockPriceConsumer];
