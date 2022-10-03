import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqSubscribeConsumerAbstract } from '@module/core/queue/RabbitmqConsumerAbstract';
import { ConsumeMessage } from 'amqplib';
import { getStateManager } from '@module/core/provider/state-manager';
import { stockPricesStartAction } from '@module/finan-info/store/stock-price/stock-price.actions';
import { StockPriceValues } from '@module/finan-info/store/stock-price/stock-price.values';

@Injectable()
export class SyncStockPriceConsumer extends RabbitmqSubscribeConsumerAbstract {
  @RabbitSubscribe({
    exchange: StockPriceValues.EXCHANGE_KEY,
    routingKey: StockPriceValues.PUBLISHER_ROUTING_KEY,
    queue: 'finan.info.queue.sync-stock-price-queue',
    queueOptions: {
      durable: true,
    },
  })
  public async pubSubHandler(msg: any, _amqpMsg: ConsumeMessage) {
    return new Promise<any>((resolve) => {
      if (typeof msg === 'string') {
        getStateManager().store.dispatch(
          stockPricesStartAction({
            code: msg,
            resolve,
          }),
        );
      }
    });
  }
}
