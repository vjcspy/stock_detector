import { Injectable } from '@nestjs/common';
import moment, { Moment } from 'moment';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Between, Repository } from 'typeorm';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { FinanAnalysisQueueValue } from '@module/finan-analysis/values/finan-analysis-queue.value';
import _ from 'lodash';
import { FaBetaValue } from '@module/finan-analysis/values/fa-beta.value';

@Injectable()
export class BetaPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    @InjectRepository(StockPriceEntity)
    private stockPriceRepo: Repository<StockPriceEntity>,
  ) {}

  public async publish() {
    const cors = await this.corRepo.find();

    _.forEach(FaBetaValue.PERIODS, async (period) => {
      const index_prices = await this.getPriceData(
        'HOSTC',
        moment().subtract(period, 'months'),
        moment(),
      );

      _.forEach(cors, async (cor) => {
        const code = cor.code;
        const stock_prices = await this.getPriceData(
          code,
          moment().subtract(period, 'months'),
          moment(),
        );

        if (stock_prices.length === index_prices.length) {
          await this.amqpConnection.publish(
            FinanAnalysisQueueValue.EXCHANGE_COMPUTE,
            `${FinanAnalysisQueueValue.ROUTING_KEY_COMPUTE}.ge.beta`,
            {
              job_id: 'compute.ge.beta',
              payload: {
                code,
                period: String(period),
                prices: {
                  stock_prices,
                  index_prices,
                },
              },
            },
            {},
          );
        }
      });
    });
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
