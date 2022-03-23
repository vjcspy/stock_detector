import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { getStateManager } from '@module/core/provider/state-manager';
import { RabbitmqSubscribeConsumerAbstract } from '@module/core/queue/RabbitmqConsumerAbstract';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-info/financial-info.actions';
import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';

@Injectable()
export class SyncFinancialBRYearConsumer extends RabbitmqSubscribeConsumerAbstract {
  @RabbitSubscribe({
    exchange: FinancialInfoValues.EXCHANGE_KEY,
    routingKey: `${FinancialInfoValues.PUBLISHER_ROUTING_KEY_BR_YEAR}`,
    queue: `${FinancialInfoValues.PUBLISHER_ROUTING_KEY_BR_YEAR}`,
    queueOptions: {
      durable: true,
    },
  })
  public async pubSubHandler(msg: any, amqpMsg: ConsumeMessage) {
    return new Promise((resolve) => {
      if (typeof msg === 'string') {
        getStateManager().store.dispatch(
          startGetFinanceInfoAction({
            code: msg,
            type: FinancialInfoType.BUSINESS_REPORT,
            termType: FinancialTermTypeEnum.YEAR,
            resolve,
          }),
        );
      }
    });
  }
}
