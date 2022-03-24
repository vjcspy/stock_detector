import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class SyncStockPricePublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
  ) {}

  public async publish() {
    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        'finan.info.sync-stock-price',
        'finan.info.sync-stock-price.cor',
        cor.code,
        {},
      );
    });

    this.publishVnIndex();
  }

  public async publishVnIndex() {
    // Lưu ý mã VNINDEX này chỉ valid trên BSC
    this.amqpConnection.publish(
      'finan.info.sync-stock-price',
      'finan.info.sync-stock-price.cor',
      'HOSTC',
      {},
    );
  }
}
