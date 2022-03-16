import { Nack } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

export abstract class RabbitmqSubscribeConsumerAbstract {
  public static resolve: (nack?: Nack) => void;
  public static reject: (error?: Error) => void;

  public subscribe(msg: any, amqpMsg: ConsumeMessage) {
    return new Promise<any>((resolve, reject) => {
      RabbitmqSubscribeConsumerAbstract.resolve = resolve;
      RabbitmqSubscribeConsumerAbstract.reject = reject;
    });
  }
}
