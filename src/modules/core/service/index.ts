import { LogService } from '@module/core/service/log.service';
import { SlackService } from '@module/core/service/slack.service';
import { CronScheduleService } from '@module/core/service/cron-schedule.service';

export const CORE_SERVICES = [LogService, SlackService, CronScheduleService];
