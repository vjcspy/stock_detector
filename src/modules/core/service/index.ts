import { LogService } from '@module/core/service/log.service';
import { SlackService } from '@module/core/service/slack.service';
import { CronStatusService } from '@module/core/service/cron-status.service';

export const CORE_SERVICES = [LogService, SlackService, CronStatusService];
