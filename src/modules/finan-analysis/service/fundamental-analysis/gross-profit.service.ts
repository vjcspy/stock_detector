import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import {
  JobResult,
  JobResultDocument,
} from '@module/core/schemas/job-result.schema';
import { Model } from 'mongoose';

@Injectable()
export class GrossProfitService {
  static JOB_ID = 'fun.ana.gp';

  private _code;

  get code() {
    return this._code;
  }

  set code(value) {
    this._code = value;
  }

  constructor(
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,

    @InjectModel(JobResult.name)
    private jobResultModel: Model<JobResultDocument>,
  ) {}

  /**
   * Trả về dữ liệu lợi nhuận gộp biên các doanh nghiệp cùng ngành qua các năm
   * Bao gồm, số lượng doanh nghiệp, trung bình của ngành trong năm, doanh nghiệp cao nhất, doanh nghiệp thấp nhất
   * @param code
   * @returns {Promise<any | null>}
   */
  async getSectorIndexData() {
    const code = this._code;
    const cor = await this.corRepo.findOne({
      code,
    });

    if (cor) {
      const sector = cor.industryName3;

      const result = await this.jobResultModel.find({
        jobId: `${GrossProfitService.JOB_ID}.sector`,
        jobKey: `${GrossProfitService.JOB_ID}.sector.${Buffer.from(sector)
          .toString('base64')
          .slice(0, 10)}`,
      });

      if (result) {
        return result;
      }
    }

    return null;
  }

  /**
   * Bao gồm: lợi nhuận gộp biên qua các năm, độ lệch chuẩn 5 năm gần nhất
   * @returns {Promise<Query<Array<HydratedDocument<JobResultDocument, {}, {}>>, JobResult & Document<any, any, any> & {_id: (JobResult & Document<any, any, any>)["_id"]}, {}, JobResult & Document<any, any, any>>>}
   */
  async getIndexData() {
    const code = this._code;
    return this.jobResultModel.find({
      jobId: `${GrossProfitService.JOB_ID}.stock`,
      jobKey: `${GrossProfitService.JOB_ID}.stock.${code}`,
    });
  }
}
