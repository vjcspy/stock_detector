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
    public cronScheduleModel: Model<CronScheduleDocument>,
  ) {}

  async cronStart(jobCode: string) {
    return this.cronScheduleModel.create({
      jobCode,
      status: CronScheduleStatus.PENDING,
      created_at: moment().tz('Asia/Ho_Chi_Minh').toDate(),
    });
  }

  async cronSuccess(jobId: string, meta?: any) {
    await this.cronScheduleModel.findByIdAndUpdate(jobId, {
      finished_at: moment().tz('Asia/Ho_Chi_Minh').toDate(),
      status: CronScheduleStatus.SUCCESS,
      meta,
    });
  }

  async runOneTimePerDay(
    jobCode: string,
    jobFn: () => Promise<any>,
    whenSuccess?: (doc: any) => Promise<any>,
  ) {
    const i = await this.cronScheduleModel.findOne({
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
        const meta = await jobFn();
        await this.cronSuccess(j._id, meta);
      }
    } else {
      if (typeof whenSuccess === 'function') {
        await whenSuccess(i);
      }
    }
  }
}
