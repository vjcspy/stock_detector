import { Injectable } from '@nestjs/common';
import moment, { Moment } from 'moment';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Between, Repository } from 'typeorm';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { FinanAnalysisQueueValue } from '@module/finan-analysis/values/finan-analysis-queue.value';

@Injectable()
export class BetaPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    @InjectRepository(StockPriceEntity)
    private stockPriceRepo: Repository<StockPriceEntity>,
  ) {}

  public async publish(
    statTime = moment().subtract(3, 'months'),
    endTime = moment(),
  ) {
    const stock_prices = await this.getPriceData(
      'BFC',
      moment().subtract(12, 'months'),
      moment(),
    );
    const index_prices = await this.getPriceData(
      'HOSTC',
      moment().subtract(12, 'months'),
      moment(),
    );

    await this.amqpConnection.publish(
      FinanAnalysisQueueValue.EXCHANGE_KEY_CALCULATE_BETA,
      FinanAnalysisQueueValue.ROUTING_KEY_CALCULATE_BETA,
      {
        code: 'BFC',
        period: '12',
        prices: {
          stock_prices,
          index_prices,
        },
      },
      {},
    );
  }

  protected async getPriceData(
    code: string,
    startTime: Moment,
    endTime: Moment,
  ) {
    return this.stockPriceRepo.find({
      order: {
        date: 'ASC',
      },
      where: {
        code,
        date: Between(
          startTime.format('YYYY-MM-DD'),
          endTime.format('YYYY-MM-DD'),
        ),
      },
    });
  }
}
