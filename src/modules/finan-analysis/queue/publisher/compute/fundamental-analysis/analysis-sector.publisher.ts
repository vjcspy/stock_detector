import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Analyst } from '@module/finan-analysis/service/analyst';
import { FinancialTermTypeEnum } from '@module/finan-info/entity/financial-info-status.entity';
import { LogService } from '@module/core/service/log.service';
import { Levels } from '@module/core/schemas/log-db.schema';
import { FinanAnalysisQueueValue } from '@module/finan-analysis/values/finan-analysis-queue.value';

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

      const sectorData = {
        sector,
        cors,
        infos: {},
      };
      for (const cor of cors) {
        const options = {
          code: cor.code,
          termType: FinancialTermTypeEnum.YEAR,
        };
        const ic = await this.analyst.info.stockGetIndicators(options);
        const bs = await this.analyst.info.stockGetBalanceSheets(options);
        const br = await this.analyst.info.stockGetBusinessReports(options);
        const cf = await this.analyst.info.stockGetCashFlows(options);

        if (
          !Array.isArray(ic) ||
          !Array.isArray(bs) ||
          !Array.isArray(br) ||
          !Array.isArray(cf) ||
          ic.length * bs.length * br.length * cf.length == 0 ||
          (ic.length * bs.length * br.length * cf.length < 500 &&
            ic.length * bs.length * br.length * cf.length !=
              Math.pow(ic.length, 4))
        ) {
          await this.log.log({
            source: 'fa',
            level: Levels.warn,
            group: 'job_publisher',
            group1: 'fundamental_analysis',
            group2: 'analysis_sector',
            message: `Không đủ dữ liệu báo cáo của cổ phiếu ${cor.code} termType: ${termType} ic${ic?.length} bs${bs?.length} br${br?.length} cf${cf?.length} `,
          });
        }

        sectorData.infos[cor.code] = { ic, bs, br, cf };
      }

      await this.log.log({
        source: 'fa',
        group: 'job_publisher',
        group1: 'fundamental_analysis',
        group2: 'gp',
        message: `publish data by sector ${sector.industryName3}`,
      });

      await this.amqpConnection.publish(
        FinanAnalysisQueueValue.EXCHANGE_COMPUTE,
        `${FinanAnalysisQueueValue.ROUTING_KEY_COMPUTE}.fundamental-analysis.sector`,
        {
          job_id: `analysis.sector`,
          payload: { sectorData },
        },
        {},
      );
    }
  }
}
