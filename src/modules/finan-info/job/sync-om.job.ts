import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LogService } from '@module/core/service/log.service';
import { OrderMatchingPublisher } from '@module/finan-info/queue/order-matching/order-matching.publisher';

@Injectable()
export class SyncOmJob {
  constructor(
    private orderMatchingPublisher: OrderMatchingPublisher,
    private log: LogService,
  ) {}

  /*
   * 16h hằng ngày sẽ lấy thêm giá
   * */
  @Cron('0 15 23 * * *', {
    name: 'fi_sync_price',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  sync1() {
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
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_om',
      message: 'Trigger sync order matching',
    });

    this.orderMatchingPublisher.publish();
  }
}
