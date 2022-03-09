import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { getStateManager } from '@module/core/provider/state-manager';
import { SyncFinancialIndicatorPublisher } from '@module/finan-info/queue/publisher/SyncFinancialIndicator.publisher';
import { RabbitmqSubscribeConsumerAbstract } from '@module/core/queue/RabbitmqConsumerAbstract';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-indicator/financial-indicator.actions';
import { FinancialTermTypeEnum } from '@module/finan-info/store/financial-indicator/financial-indicator.reducer';

@Injectable()
export class SyncFinancialIndicatorQuarterConsumer extends RabbitmqSubscribeConsumerAbstract {
  // @RabbitSubscribe({
  //   exchange: SyncFinancialIndicatorPublisher.EXCHANGE,
  //   routingKey: SyncFinancialIndicatorPublisher.ROUTING_KEY,
  //   queue: 'finan.info.queue.sync-financial-indicator-quarter-queue',
  //   queueOptions: {
  //     durable: true,
  //   },
  // })
  // public async pubSubHandler(msg: any, amqpMsg: ConsumeMessage) {
  //   setTimeout(() => {
  //     if (typeof msg === 'string') {
  //       getStateManager().store.dispatch(
  //         startGetFinanceInfoAction({
  //           code: msg,
  //           termType: FinancialTermTypeEnum.QUARTER,
  //         }),
  //       );
  //     }
  //   }, 0);
  //   return this.subscribe(msg, amqpMsg);
  // }
}
