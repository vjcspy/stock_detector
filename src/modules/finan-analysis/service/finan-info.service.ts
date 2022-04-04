import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import { FinancialTermTypeEnum } from '@module/finan-info/entity/financial-info-status.entity';

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
  ) {}

  async getStocksBySector(name: any) {
    let id3: string;
    if (typeof name === 'string') {
      id3 = name;
    } else if (typeof name === 'object') {
      id3 = name['industryName3'];
    }
    return this.corRepo.find({
      industryName3: id3,
    });
  }

  async getSectors(): Promise<
    {
      count: number;
      industryName3: string;
    }[]
  > {
    return this.corRepo.query(
      `SELECT count(*) as count, industryName3 from cor_entity GROUP BY industryName3`,
    );
  }

  async getFinancialIndicatorBySector(
    sector: any,
    termTypeEnum: FinancialTermTypeEnum = FinancialTermTypeEnum.YEAR,
  ) {
    const cors = await this.getStocksBySector(sector);

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
