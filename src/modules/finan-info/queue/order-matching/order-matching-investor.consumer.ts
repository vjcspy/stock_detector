import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';
import { ConsumeMessage } from 'amqplib';
import { getStateManager } from '@module/core/provider/state-manager';
import { syncOrderMatching } from '@module/finan-info/store/order-matching/order-matching.actions';
import { OrderMatchingType } from '@module/finan-info/schema/order-matching.schema';

export class OrderMatchingInvestorConsumer {
  @RabbitSubscribe({
    exchange: FinancialInfoValues.EXCHANGE_KEY,
    routingKey: FinancialInfoValues.ORDER_MATCHING_KEY,
    queue: FinancialInfoValues.ORDER_MATCHING_KEY + '_QUEUE',
    queueOptions: {
      durable: true,
    },
  })
  public async pubSubHandler(msg: any, amqpMsg: ConsumeMessage) {
    return new Promise((resolve) => {
      if (typeof msg === 'string') {
        getStateManager().store.dispatch(
          syncOrderMatching.ACTION({
            code: msg,
            type: OrderMatchingType.INVESTOR,
            force: true,
            resolve,
          }),
        );
      }
    });
  }
}
