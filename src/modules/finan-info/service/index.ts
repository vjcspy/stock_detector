import { JobSyncStatusService } from '@module/finan-info/service/job-sync-status.service';
import { CorService } from '@module/finan-info/service/cor.service';
import { StockPriceSyncStatusService } from '@module/finan-info/service/stock-price-sync-status.service';
import { StockPriceService } from '@module/finan-info/service/stock-price.service';

export const FINAN_INFO_SERVICES = [
  JobSyncStatusService,
  CorService,
  StockPriceSyncStatusService,
  StockPriceService,
];
