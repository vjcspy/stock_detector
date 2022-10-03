import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Between, Repository } from 'typeorm';
import { StockPriceEntity } from '@module/finan-info/entity/stock-price.entity';
import { FinanAnalysisQueueValue } from '@module/finan-analysis/values/finan-analysis-queue.value';
import { ComputeAlphaDto } from '@module/finan-analysis/dto/compute.dto';
import moment, { Moment } from 'moment';

@Injectable()
export class ComputePublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    @InjectRepository(StockPriceEntity)
    private stockPriceRepo: Repository<StockPriceEntity>,
  ) {}

  protected getRoutingKey() {
    return `${FinanAnalysisQueueValue.ROUTING_KEY_COMPUTE}`;
  }

  public async publishComputeAlpha(request: ComputeAlphaDto) {
    const startTime = moment(request.startTime, 'YYYY-MM-DD');
    const endTime = request?.endTime
      ? moment(request.endTime, 'YYYY-MM-DD')
      : moment();

    // get stock prices
    const code1Prices = await this.getPrices(request.code1, startTime, endTime);
    const code2Prices = await this.getPrices(request.code2, startTime, endTime);

    if (code1Prices.length !== code2Prices.length) {
      throw new Error(
        '2 mã này số lượng records đang không bằng nhau, hiện tại chưa support',
      );
    }



    return `com_alpha_${request.code1}_${request.code2}_${startTime.format(
      'YYYYMMDD',
    )}_${endTime.format('YYYYMMDD')}`;
  }

  protected async getPrices(code: string, startTime: Moment, endTime: Moment) {
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
