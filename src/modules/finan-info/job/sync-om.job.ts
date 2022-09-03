import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LogService } from '@module/core/service/log.service';
import { OrderMatchingPublisher } from '@module/finan-info/queue/order-matching/order-matching.publisher';
import { SLACK_CHANNEL } from '@cfg/slack.cfg';
import { SlackService } from '@module/core/service/slack.service';
import { CronScheduleService } from '@module/core/service/cron-schedule.service';
import { isFirstProcessPm2 } from '@module/core/util/env';
import { CronScheduleDocument } from '@module/core/schemas/cron-schedule.schema';
import { JobSyncStatusService } from '@module/finan-info/service/job-sync-status.service';
import moment from 'moment';
import { isNumber } from 'lodash';

@Injectable()
export class SyncOmJob {
  static SyncOmJob_CODE = 'publish_queue_sync_om';
  private readonly logger = new Logger(SyncOmJob.name);
  constructor(
    private orderMatchingPublisher: OrderMatchingPublisher,
    private log: LogService,
    private slackService: SlackService,
    private cronScheduleService: CronScheduleService,
    private jobSyncStatusService: JobSyncStatusService,
  ) {}

  private isPostMess = false;

  /*
   * Từ 16h mỗi 15 phuts sẽ trigger lấy giá 1 lần, check chỉ run 1 lần trong ngày
   * */
  @Cron('* */15 17-23 * * *', {
    name: SyncOmJob.SyncOmJob_CODE,
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  sync() {
    if (!isFirstProcessPm2()) return;

    this.cronScheduleService.runOneTimePerDay(
      SyncOmJob.SyncOmJob_CODE,
      async () => {
        this.isPostMess = false;
        await this.slackService.postMessage(
          SLACK_CHANNEL.GENERAL_CHIAKI_BOT_CHANNEL,
          {
            text: 'Trigger sync order matching',
          },
        );
        await this.log.log({
          source: 'cron',
          group: 'fi',
          group1: 'sync_om',
          message: 'Trigger sync order matching',
        });

        return await this.orderMatchingPublisher.publish();
      },
      async (doc: CronScheduleDocument) => {
        if (this.isPostMess) {
          return;
        }

        const n = doc.meta?.size;

        if (!isNumber(n)) {
          this.logger.debug(
            `could not found schedule job info ${SyncOmJob.SyncOmJob_CODE}`,
          );
          this.slackService.postMessage(
            SLACK_CHANNEL.GENERAL_CHIAKI_BOT_CHANNEL,
            {
              text: `could not found schedule job info ${SyncOmJob.SyncOmJob_CODE}`,
            },
          );
          return;
        }

        const ns =
          await this.jobSyncStatusService.jobSyncStatusModel.countDocuments({
            k: new RegExp(`^sync_om_`),
            s: true,
          });

        if (parseInt(n as any) !== 0 && ns === 2 * n) {
          const e = await this.jobSyncStatusService.jobSyncStatusModel.findOne(
            {
              k: new RegExp(`^sync_om_`),
              s: true,
            },
            undefined,
            {
              sort: {
                updatedAt: -1, //Sort by Date Added DESC
              },
            },
          );
          const s = await this.jobSyncStatusService.jobSyncStatusModel.findOne(
            {
              k: new RegExp(`^sync_om_`),
              s: true,
            },
            undefined,
            {
              sort: {
                createdAt: 1,
              },
            },
          );
          // @ts-ignore
          const d = moment(e.updatedAt).diff(moment(s.createdAt), 'seconds');
          this.logger.debug(`sync OM successfully and took ${d} seconds`);
          this.slackService.postMessage(
            SLACK_CHANNEL.GENERAL_CHIAKI_BOT_CHANNEL,
            {
              text: `sync OM successfully and took ${d} seconds`,
            },
          );
          this.isPostMess = true;
        }
      },
    );
  }
}
