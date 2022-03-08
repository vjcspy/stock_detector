import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class SyncFinancialIndicatorPublisher {
  static EXCHANGE = 'finan.info.sync-financial-indicator';
  static ROUTING_KEY = 'finan.info.sync-financial-indicator.cor';

  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
  ) {}

  async publish() {
    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        SyncFinancialIndicatorPublisher.EXCHANGE,
        SyncFinancialIndicatorPublisher.ROUTING_KEY,
        cor.code,
        {},
      );
    });
  }
}
