import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { getStateManager } from '@module/core/provider/state-manager';
import { SyncFinancialIndicatorPublisher } from '@module/finan-info/queue/publisher/SyncFinancialIndicator.publisher';
import { RabbitmqSubscribeConsumerAbstract } from '@module/core/queue/RabbitmqConsumerAbstract';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-info/financial-info.actions';
import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';

@Injectable()
export class SyncFinancialIndicatorYearConsumer extends RabbitmqSubscribeConsumerAbstract {
  @RabbitSubscribe({
    exchange: SyncFinancialIndicatorPublisher.EXCHANGE,
    routingKey: SyncFinancialIndicatorPublisher.ROUTING_KEY,
    queue: 'finan.info.queue.sync-financial-indicator-year-queue',
    queueOptions: {
      durable: true,
    },
  })
  public async pubSubHandler(msg: any, amqpMsg: ConsumeMessage) {
    return new Promise((resolve, reject) => {
      if (typeof msg === 'string') {
        getStateManager().store.dispatch(
          startGetFinanceInfoAction({
            code: msg,
            type: FinancialInfoType.INDICATOR,
            termType: FinancialTermTypeEnum.YEAR,
            resolve,
            reject,
          }),
        );
      }
    });
  }
}
