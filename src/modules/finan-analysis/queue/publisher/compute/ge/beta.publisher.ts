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
import { LogService } from '@module/core/service/log.service';
import { Levels } from '@module/core/schemas/log-db.schema';
import { JobResultService } from '@module/finan-analysis/service/job-result.service';

@Injectable()
export class BetaPublisher {
  static JOB_ID = 'compute.ge.beta';

  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    @InjectRepository(StockPriceEntity)
    private stockPriceRepo: Repository<StockPriceEntity>,
    private log: LogService,
    private jobResultService: JobResultService,
  ) {}

  public async publish() {
    // clear last result
    await this.jobResultService.clearResults(BetaPublisher.JOB_ID);

    const cors = await this.corRepo.find();

    _.forEach(FaBetaValue.PERIODS, async (period) => {
      const index_prices = await this.getPriceData(
        'HOSTC',
        moment().subtract(period, 'months'),
        moment(),
      );

      _.forEach(cors, async (cor) => {
        const code = cor.code;

        if (typeof code === 'string' && code.length !== 3) {
          return true;
        }

        const stock_prices = await this.getPriceData(
          code,
          moment().subtract(period, 'months'),
          moment(),
        );

        if (stock_prices.length === index_prices.length) {
          this.log.log({
            source: 'fa',
            group: 'job_publisher',
            group1: 'compute.beta',
            group2: code,
            message: `compute beta ${code}|${period} `,
          });
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
        } else {
          this.log.log({
            level: Levels.warn,
            source: 'fa',
            group: 'job_publisher',
            group1: 'compute.beta',
            group2: code,
            message: `Dữ liệu không đủ để tính beta ${code}|${period} `,
          });
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
        date: Between(startTime.toDate(), endTime.toDate()),
      },
    });
  }
}
