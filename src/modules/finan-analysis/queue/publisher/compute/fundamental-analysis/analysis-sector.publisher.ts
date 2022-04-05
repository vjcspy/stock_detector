import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Analyst } from '@module/finan-analysis/service/analyst';
import { FinancialTermTypeEnum } from '@module/finan-info/entity/financial-info-status.entity';
import _ from 'lodash';
import { LogService } from '@module/core/service/log.service';

@Injectable()
export class AnalysisSectorPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly analyst: Analyst,
    private log: LogService,
  ) {}

  public async publishSector(
    termType: FinancialTermTypeEnum = FinancialTermTypeEnum.YEAR,
  ) {
    const sectors = await this.analyst.sector.getSectors();

    for (const sector of sectors) {
      const cors = await this.analyst.sector.getStocksBySector(sector);

      const indicators = await this.analyst.info.getFinancialIndicatorBySector(
        sector,
      );

      this.log.log({
        source: 'fa',
        group: 'job_publisher',
        group1: 'fundamental_analysis',
        group2: 'gp',
        message: `publish data by sector ${sector.industryName3}`,
      });
    }
  }
}
