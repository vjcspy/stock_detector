import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { FinanAnalysisQueueValue } from '@module/finan-analysis/values/finan-analysis-queue.value';

@Injectable()
export class TestPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    @InjectRepository(StockPriceEntity)
    private stockPriceRepo: Repository<StockPriceEntity>,
  ) {}

  publish() {
    this.amqpConnection.publish(
      FinanAnalysisQueueValue.EXCHANGE_COMPUTE,
      `${FinanAnalysisQueueValue.ROUTING_KEY_COMPUTE}.ge.-`,
      {
        job_id: 'compute.ge.beta',
        payload: {},
      },
      {},
    );
  }
}
