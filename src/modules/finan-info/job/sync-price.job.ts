import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';
import { LogService } from '@module/core/service/log.service';
import { SlackService } from '@module/core/service/slack.service';
import { SLACK_CHANNEL } from '@cfg/slack.cfg';

@Injectable()
export class SyncPriceJob {
  constructor(
    private syncStockPricePublisher: SyncStockPricePublisher,
    private log: LogService,
    private slackService: SlackService,
  ) {}

  /*
   * 16h hằng ngày sẽ lấy thêm giá
   * */
  @Cron('0 0 16 * * *', {
    name: 'fi_sync_price',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  publishSyncPrice() {
    if (process.env.INSTANCE_ID !== '0') return;

    this.slackService.postMessage(SLACK_CHANNEL.GENERAL_CHIAKI_BOT_CHANNEL, {
      text: 'Trigger sync price',
    });
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_price',
      message: 'Trigger sync price',
    });

    this.syncStockPricePublisher.publish();
  }
}
