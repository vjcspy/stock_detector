import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class SyncStockPriceConsumer {
  @RabbitSubscribe({
    exchange: 'finan.info.sync-stock-price',
    routingKey: 'finan.info.sync-stock-price.cor',
    queue: 'finan.info.queue.sync-stock-price-queue',
    queueOptions: {
      durable: true,
    },
  })
  public async rpcHandler(msg: any) {
    console.log(`Receive pub/sub message: ${JSON.stringify(msg)}`);
    /*
     * TODO: Do nó không có cơ chế no-ack nên bắt buốc phải không được trả về value
     * */
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Done pub/sub message: ${JSON.stringify(msg)}`);
        resolve();
      }, 3000);
    });
  }
}
