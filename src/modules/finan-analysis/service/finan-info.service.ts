import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import { FinancialTermTypeEnum } from '@module/finan-info/entity/financial-info-status.entity';
import { SectorService } from '@module/finan-analysis/service/sector.service';
import { FinancialBalanceSheetEntity } from '@module/finan-info/entity/financial-balance-sheet.entity';
import { FinancialBusinessReportEntity } from '@module/finan-info/entity/financial-business-report.entity';
import { FinancialCashFlowEntity } from '@module/finan-info/entity/financial-cash-flow.entity';

@Injectable()
export class FinanInfoService {
  get code() {
    return this._code;
  }

  set code(value) {
    this._code = value;
  }
  private _code;

  constructor(
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    @InjectRepository(FinancialIndicatorsEntity)
    private inRepo: Repository<FinancialIndicatorsEntity>,

    @InjectRepository(FinancialBalanceSheetEntity)
    private bsRepo: Repository<FinancialBalanceSheetEntity>,

    @InjectRepository(FinancialBusinessReportEntity)
    private brRepo: Repository<FinancialBusinessReportEntity>,

    @InjectRepository(FinancialCashFlowEntity)
    private cfRepo: Repository<FinancialCashFlowEntity>,
    private sectorService: SectorService,
  ) {}

  async getFinancialIndicatorBySector(
    sector: any,
    termTypeEnum: FinancialTermTypeEnum = FinancialTermTypeEnum.YEAR,
  ) {
    const cors = await this.sectorService.getStocksBySector(sector);

    const data = {};
    for (const cor of cors) {
      const corFI = await this.inRepo
        .createQueryBuilder('fi')
        .where('fi.code = :code', { code: cor.code })
        .andWhere('fi.termType = :termType', { termType: termTypeEnum })
        .getMany();

      data[cor.code] = corFI;
    }

    return data;
  }

  protected _getDefaultDataFromOption(options: any) {
    let code = this.code;
    if (options.code) {
      code = options.code;
    }
    if (typeof code !== 'string') {
      throw new Error('pass code data');
    }

    return { code, termType: options?.termType ?? FinancialTermTypeEnum.YEAR };
  }

  public async stockGetIndicators(
    options: {
      code?: string;
      termType?: FinancialTermTypeEnum;
    } = {},
  ) {
    const { code, termType } = this._getDefaultDataFromOption(options);
    return this.inRepo
      .createQueryBuilder('e')
      .where('fi.code = :code', { code })
      .andWhere('fi.termType = :termType', { termType })
      .orderBy('e.id', 'DESC')
      .getMany();
  }

  public async stockGetBalanceSheets(
    options: {
      code?: string;
    } = {},
  ) {
    const code = this._getDefaultDataFromOption(options);
  }

  public async stockGetBusinessReports(
    options: {
      code?: string;
    } = {},
  ) {
    const code = this._getDefaultDataFromOption(options);
  }

  public async stockGetCashFlows(
    options: {
      code?: string;
    } = {},
  ) {
    const code = this._getDefaultDataFromOption(options);
  }
}
