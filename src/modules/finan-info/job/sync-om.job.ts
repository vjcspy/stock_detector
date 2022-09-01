import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LogService } from '@module/core/service/log.service';
import { OrderMatchingPublisher } from '@module/finan-info/queue/order-matching/order-matching.publisher';
import { SLACK_CHANNEL } from '@cfg/slack.cfg';
import { SlackService } from '@module/core/service/slack.service';
import { CronScheduleService } from '@module/core/service/cron-schedule.service';
import { isFirstProcessPm2 } from '@module/core/util/env';

@Injectable()
export class SyncOmJob {
  static SyncOmJob_CODE = 'fi_sync_price';

  constructor(
    private orderMatchingPublisher: OrderMatchingPublisher,
    private log: LogService,
    private slackService: SlackService,
    private cronScheduleService: CronScheduleService,
  ) {}

  /*
   * Từ 16h mỗi 15 phuts sẽ trigger lấy giá 1 lần, check chỉ run 1 lần trong ngày
   * */
  @Cron('* */15 16-23 * * *', {
    name: SyncOmJob.SyncOmJob_CODE,
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  sync() {
    this.cronScheduleService.runOneTimePerDay(
      SyncOmJob.SyncOmJob_CODE,
      async () => {
        if (!isFirstProcessPm2()) return;

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

        await this.orderMatchingPublisher.publish();
      },
    );
  }
}
