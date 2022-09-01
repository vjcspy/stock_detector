import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CronSchedule,
  CronScheduleDocument,
  CronScheduleStatus,
} from '@module/core/schemas/cron-schedule.schema';
import { Model } from 'mongoose';
import moment from 'moment';

@Injectable()
export class CronScheduleService {
  constructor(
    @InjectModel(CronSchedule.name)
    public cronStatusModel: Model<CronScheduleDocument>,
  ) {}

  async cronStart(jobCode: string) {
    return this.cronStatusModel.create({
      jobCode,
      status: CronScheduleStatus.PENDING,
      created_at: new Date(),
    });
  }

  async cronSuccess(jobId: string) {
    await this.cronStatusModel.findByIdAndUpdate(jobId, {
      finished_at: new Date(),
      status: CronScheduleStatus.SUCCESS,
    });
  }

  async runOneTimePerDay(jobCode: string, jobFn: () => Promise<void>) {
    const i = await this.cronStatusModel.findOne({
      jobCode,
      created_at: {
        $gte: moment().hour(0).minute(0).second(0).toDate(),
        $lt: moment().hour(23).minute(59).second(59).toDate(),
      },
      status: CronScheduleStatus.SUCCESS,
    });

    if (!i) {
      const j = await this.cronStart(jobCode);
      if (j?._id) {
        await jobFn();
        await this.cronSuccess(j._id);
      }
    }
  }
}
