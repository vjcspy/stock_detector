import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';

@Injectable()
export class SyncFinancialInfoPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
  ) {}

  async publish() {
    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY,
        cor.code,
        {},
      );
    });
  }
}
