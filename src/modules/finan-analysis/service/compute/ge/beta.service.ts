import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaBetaEntity } from '@module/finan-analysis/entity/fa-beta.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  JobResult,
  JobResultDocument,
} from '@module/core/schemas/job-result.schema';
import { Model } from 'mongoose';
import { FaBetaValue } from '@module/finan-analysis/values/fa-beta.value';
import _ from 'lodash';

@Injectable()
export class BetaService {
  constructor(
    @InjectRepository(FaBetaEntity)
    private faBetaRepo: Repository<FaBetaEntity>,
    @InjectModel(JobResult.name)
    private jobResultModel: Model<JobResultDocument>,
  ) {}

  public updateBeta() {
    FaBetaValue.PERIODS.forEach((period) => this.updateBetaPeriod(period));
  }

  protected async updateBetaPeriod(period: number) {
    const betaRecords = await this.jobResultModel.find({
      'result.period': { $eq: String(period) },
    });
    let faBetas = _.map(betaRecords, (r) => {
      const data = {
        code: r.result.code,
      };
      data['beta_' + period] = parseFloat(r.result.beta);

      return data;
    });
    faBetas = _.uniqBy(faBetas, 'code');
    if (faBetas.length > 0) {
      await this.faBetaRepo.upsert(faBetas, ['code']);
    }
  }
}
