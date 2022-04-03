import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  JobResult,
  JobResultDocument,
} from '@module/core/schemas/job-result.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobResultService {
  constructor(
    @InjectModel(JobResult.name)
    private jobResultModel: Model<JobResultDocument>,
  ) {}

  async clearResults(jobId: string) {
    return this.jobResultModel.remove({
      jobId,
    });
  }
}
