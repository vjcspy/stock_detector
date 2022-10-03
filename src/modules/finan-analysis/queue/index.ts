import { TestPublisher } from '@module/finan-analysis/queue/publisher/test.publisher';
import { COMPUTE_GE_PUBLISHER } from '@module/finan-analysis/queue/publisher/compute/ge';
import { FUNDAMENTAL_ANALYSIS_PUBLISHERS } from '@module/finan-analysis/queue/publisher/compute/fundamental-analysis';
import { ComputePublisher } from '@module/finan-analysis/queue/publisher/compute.publisher';

export const ANALYSIS_QUEUE = [
  ...COMPUTE_GE_PUBLISHER,
  ...FUNDAMENTAL_ANALYSIS_PUBLISHERS,
  TestPublisher,
  ComputePublisher,
];
