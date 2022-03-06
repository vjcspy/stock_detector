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
    console.log(`Received pub/sub message: ${JSON.stringify(msg)}`);
  }
}
