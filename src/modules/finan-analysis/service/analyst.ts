import { Injectable } from '@nestjs/common';
import { GrossProfitService } from '@module/finan-analysis/service/fundamental-analysis/gross-profit.service';
import { FinanInfoService } from '@module/finan-analysis/service/finan-info.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Analyst {
  protected code: string;
  constructor(
    private grossProfitService: GrossProfitService,
    public finanInfoService: FinanInfoService,
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
  ) {}

  load(code: string) {
    this.code = code;

    return {
      info: () => {
        this.finanInfoService.code = this.code;

        return this.finanInfoService;
      },
      fa: {
        gp: () => {
          this.grossProfitService.code = this.code;

          return this.grossProfitService;
        },
      },
    };
  }
}
