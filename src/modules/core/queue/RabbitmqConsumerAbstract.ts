import { ConsumeMessage } from 'amqplib';

export abstract class RabbitmqSubscribeConsumerAbstract {
  public static resolve: () => void;
  public static reject: (error?: Error) => void;

  public subscribe(msg: any, amqpMsg: ConsumeMessage) {
    return new Promise<void>((resolve, reject) => {
      RabbitmqSubscribeConsumerAbstract.resolve = resolve;
      RabbitmqSubscribeConsumerAbstract.reject = reject;
    });
  }
}
