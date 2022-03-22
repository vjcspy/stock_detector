import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqSubscribeConsumerAbstract } from '@module/core/queue/RabbitmqConsumerAbstract';
import { ConsumeMessage } from 'amqplib';
import { getStateManager } from '@module/core/provider/state-manager';
import { stockPricesStartAction } from '@module/finan-info/store/stock-price/stock-price.actions';

@Injectable()
export class SyncStockPriceConsumer extends RabbitmqSubscribeConsumerAbstract {
  @RabbitSubscribe({
    exchange: 'finan.info.sync-stock-price',
    routingKey: 'finan.info.sync-stock-price.cor',
    queue: 'finan.info.queue.sync-stock-price-queue',
    queueOptions: {
      durable: true,
    },
  })
  public async pubSubHandler(msg: any, amqpMsg: ConsumeMessage) {
    return new Promise<any>((resolve, reject) => {
      if (typeof msg === 'string') {
        getStateManager().store.dispatch(
          stockPricesStartAction({
            code: msg,
            resolve,
            reject,
          }),
        );
      }
    });
  }
}
