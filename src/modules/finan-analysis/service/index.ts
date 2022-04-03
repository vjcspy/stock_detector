import { JobResultService } from '@module/finan-analysis/service/job-result.service';
import { FUNDAMENTAL_ANALYSIS_SERVICES } from '@module/finan-analysis/service/fundamental-analysis';
import { COMPUTE_SERVICES } from '@module/finan-analysis/service/compute';
import { Analyst } from '@module/finan-analysis/service/analyst';
import { FinanInfoService } from '@module/finan-analysis/service/finan-info.service';

export const FA_SERVICES = [
  JobResultService,
  Analyst,
  FinanInfoService,
  ...COMPUTE_SERVICES,
  ...FUNDAMENTAL_ANALYSIS_SERVICES,
];
