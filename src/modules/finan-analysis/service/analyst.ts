import { Injectable } from '@nestjs/common';
import { FinanInfoService } from '@module/finan-analysis/service/finan-info.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { SectorService } from '@module/finan-analysis/service/sector.service';
import { AnalysisYearIndexService } from '@module/finan-analysis/service/analysis-year-index.service';

@Injectable()
export class Analyst {
  protected code: string;
  constructor(
    private finanInfoService: FinanInfoService,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
    private sectorService: SectorService,
    private analysisYearIndexService: AnalysisYearIndexService,
  ) {}

  get sector() {
    return this.sectorService;
  }

  get info() {
    return this.finanInfoService;
  }

  get analysisYearIndex() {
    return this.analysisYearIndexService;
  }

  load(code: string) {
    this.code = code;

    return {
      analysisYearIndex: (analysisCode: string) => {
        this.analysisYearIndexService.analysisCode = analysisCode;
        this.analysisYearIndexService.code = this.code;

        return this.analysisYearIndexService;
      },
    };
  }
}
