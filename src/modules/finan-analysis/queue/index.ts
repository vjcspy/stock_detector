import { BetaPublisher } from '@module/finan-analysis/queue/publisher/beta.publisher';
import { TestPublisher } from '@module/finan-analysis/queue/publisher/test.publisher';

export const ANALYSIS_QUEUE = [BetaPublisher, TestPublisher];
