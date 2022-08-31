import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LogService } from '@module/core/service/log.service';
import { OrderMatchingPublisher } from '@module/finan-info/queue/order-matching/order-matching.publisher';
import { SLACK_CHANNEL } from '@cfg/slack.cfg';
import { SlackService } from '@module/core/service/slack.service';
import { CronStatusService } from '@module/core/service/cron-status.service';

@Injectable()
export class SyncOmJob {
  constructor(
    private orderMatchingPublisher: OrderMatchingPublisher,
    private log: LogService,
    private slackService: SlackService,
    private cronStatusService: CronStatusService,
  ) {}

  /*
   * 16h hằng ngày sẽ lấy thêm giá
   * */
  @Cron('0 15 23 * * *', {
    name: 'fi_sync_price',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  sync1() {
    if (process.env.INSTANCE_ID !== '0') return;

    this.slackService.postMessage(SLACK_CHANNEL.GENERAL_CHIAKI_BOT_CHANNEL, {
      text: 'Trigger sync order matching',
    });
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_om',
      message: 'Trigger sync order matching',
    });

    this.orderMatchingPublisher.publish();
  }

  @Cron('0 2 16 * * *', {
    name: 'fi_sync_price',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  sync2() {
    if (process.env.INSTANCE_ID !== '0') return;
    this.slackService.postMessage(SLACK_CHANNEL.GENERAL_CHIAKI_BOT_CHANNEL, {
      text: 'Trigger sync order matching',
    });
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_om',
      message: 'Trigger sync order matching',
    });

    this.orderMatchingPublisher.publish();
  }
}
