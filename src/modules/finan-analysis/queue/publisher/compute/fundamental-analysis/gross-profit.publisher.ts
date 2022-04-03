import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { LogService } from '@module/core/service/log.service';
import { JobResultService } from '@module/finan-analysis/service/job-result.service';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import { Analyst } from '@module/finan-analysis/service/analyst';
import { FinanAnalysisQueueValue } from '@module/finan-analysis/values/finan-analysis-queue.value';
import { GrossProfitService } from '@module/finan-analysis/service/fundamental-analysis/gross-profit.service';

@Injectable()
export class GrossProfitPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    @InjectRepository(FinancialIndicatorsEntity)
    private fiRepo: Repository<FinancialIndicatorsEntity>,
    private log: LogService,
    private jobResultService: JobResultService,
    private analyst: Analyst,
  ) {}

  public async publishCalculateSector() {
    const sectors = await this.analyst.finanInfoService.getSectors();

    for (const sector of sectors) {
      const fiSector =
        await this.analyst.finanInfoService.getFinancialIndicatorBySector(
          sector,
        );

      this.log.log({
        source: 'fa',
        group: 'job_publisher',
        group1: 'fundamental_analysis',
        group2: 'gp',
        message: `calculate gross profit sector ${sector['industryName3']}`,
      });
      await this.amqpConnection.publish(
        FinanAnalysisQueueValue.EXCHANGE_COMPUTE,
        `${FinanAnalysisQueueValue.ROUTING_KEY_COMPUTE}.fundamental_analysis.gp`,
        {
          job_id: `${GrossProfitService.JOB_ID}`,
          payload: {
            sector,
            fiSector,
          },
        },
        {},
      );
    }
  }
}
