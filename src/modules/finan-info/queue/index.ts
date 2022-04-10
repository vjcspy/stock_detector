import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';
import { SyncStockPriceConsumer } from '@module/finan-info/queue/consumer/SyncStockPrice.consumer';
import { SyncFinancialIndicatorYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorYear.consumer';
import { SyncFinancialInfoPublisher } from '@module/finan-info/queue/publisher/SyncFinancialInfo.publisher';
import { SyncFinancialBRQuarterConsumer } from '@module/finan-info/queue/consumer/SyncFinancialBRQuarter.consumer';
import { SyncFinancialBRYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialBRYear.consumer';
import { SyncFinancialBSQuarterConsumer } from '@module/finan-info/queue/consumer/SyncFinancialBSQuarter.consumer';
import { SyncFinancialBSYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialBSYear.consumer';
import { SyncFinancialCFQuarterConsumer } from '@module/finan-info/queue/consumer/SyncFinancialCFQuarter.consumer';
import { SyncFinancialCFYearConsumer } from '@module/finan-info/queue/consumer/SyncFinancialCFYear.consumer';
import { SyncFinancialIndicatorQuarterConsumer } from '@module/finan-info/queue/consumer/SyncFinancialIndicatorQuarter.consumer';
import { OrderMatchingHistoryConsumer } from '@module/finan-info/queue/order-matching/order-matching-history.consumer';
import { OrderMatchingInvestorConsumer } from '@module/finan-info/queue/order-matching/order-matching-investor.consumer';
import { OrderMatchingPublisher } from '@module/finan-info/queue/order-matching/order-matching.publisher';

export const QUEUE_PROVIDES = [
  /* Sync price*/
  SyncStockPricePublisher,
  SyncStockPriceConsumer,

  /**/
  SyncFinancialInfoPublisher,

  /* Sync Financial Info*/
  SyncFinancialBRQuarterConsumer,
  SyncFinancialBRYearConsumer,

  SyncFinancialBSQuarterConsumer,
  SyncFinancialBSYearConsumer,

  SyncFinancialCFQuarterConsumer,
  SyncFinancialCFYearConsumer,

  SyncFinancialIndicatorQuarterConsumer,
  SyncFinancialIndicatorYearConsumer,

  // ORDER MATCHING
  OrderMatchingHistoryConsumer,
  OrderMatchingInvestorConsumer,
  OrderMatchingPublisher,
];
