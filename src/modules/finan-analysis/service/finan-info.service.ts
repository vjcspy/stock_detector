import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import { FinancialTermTypeEnum } from '@module/finan-info/entity/financial-info-status.entity';
import { SectorService } from '@module/finan-analysis/service/sector.service';

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
    private fiRepo: Repository<FinancialIndicatorsEntity>,
    private sectorService: SectorService,
  ) {}

  async getFinancialIndicatorBySector(
    sector: any,
    termTypeEnum: FinancialTermTypeEnum = FinancialTermTypeEnum.YEAR,
  ) {
    const cors = await this.sectorService.getStocksBySector(sector);

    const data = {};
    for (const cor of cors) {
      const corFI = await this.fiRepo
        .createQueryBuilder('fi')
        .where('fi.code = :code', { code: cor.code })
        .andWhere('fi.termType = :termType', { termType: termTypeEnum })
        .getMany();

      data[cor.code] = corFI;
    }

    return data;
  }
}
