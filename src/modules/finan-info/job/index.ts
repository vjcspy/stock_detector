import { SyncPriceJob } from '@module/finan-info/job/sync-price.job';
import { SyncFinancialInfoJob } from '@module/finan-info/job/sync-financial-info.job';
import { SyncOmJob } from '@module/finan-info/job/sync-om.job';
import { TestTaskJob } from '@module/finan-info/job/test-task.job';

export const FI_JOBS = [
  SyncPriceJob,
  SyncFinancialInfoJob,
  SyncOmJob,
  TestTaskJob,
];
