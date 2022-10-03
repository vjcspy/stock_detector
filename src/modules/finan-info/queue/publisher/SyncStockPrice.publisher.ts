import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { StockPriceValues } from '@module/finan-info/store/stock-price/stock-price.values';
import { FinanInfoConstant } from '@module/finan-info/constant/finan-info.constant';

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
        StockPriceValues.EXCHANGE_KEY,
        StockPriceValues.PUBLISHER_ROUTING_KEY,
        cor.code,
        {},
      );
    });

    this.publishVnIndex();
  }

  public async publishVnIndex() {
    // Lưu ý mã VNINDEX này chỉ valid trên BSC
    this.amqpConnection.publish(
      StockPriceValues.EXCHANGE_KEY,
      StockPriceValues.PUBLISHER_ROUTING_KEY,
      FinanInfoConstant.VNINDEX_CODE,
      {},
    );
  }
}
