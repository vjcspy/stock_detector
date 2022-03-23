import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';
import { LogService } from '@module/core/service/log.service';

@Injectable()
export class SyncPriceJob {
  constructor(
    private syncStockPricePublisher: SyncStockPricePublisher,
    private log: LogService,
  ) {}

  /*
   * 16h hằng ngày sẽ lấy thêm giá
   * */
  @Cron('0 0 16 * * *', {
    name: 'fi_sync_price',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  publishSyncPrice() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_price',
      message: 'Trigger sync price',
    });

    this.syncStockPricePublisher.publish();
  }
}
