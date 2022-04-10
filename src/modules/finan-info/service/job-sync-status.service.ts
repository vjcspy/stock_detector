import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  JobSyncStatus,
  JobSyncStatusDocument,
} from '@module/finan-info/schema/job-sync-status.schema';
import { Model } from 'mongoose';
import moment from 'moment';

@Injectable()
export class JobSyncStatusService {
  static INFOS: { id: string; meta: any }[] = [];
  constructor(
    @InjectModel(JobSyncStatus.name)
    private jobSyncStatusModel: Model<JobSyncStatusDocument>,
  ) {}

  async getStatus(k: string) {
    return this.jobSyncStatusModel
      .findOne({
        k,
      })
      .lean();
  }

  async saveSuccessStatus(k: string, status: any) {
    return this.jobSyncStatusModel.updateOne(
      {
        k,
      },
      status,
      {
        upsert: true,
        strict: false,
      },
    );
  }

  async saveErrorStatus(k: string, error: any) {
    const status = await this.jobSyncStatusModel.findOne({ k }).lean();
    if (!status?._id) {
      await this.jobSyncStatusModel.create({
        k,
        n: 1,
        s: false,
        meta: {
          error,
        },
        date: moment().toDate(),
      });
    } else {
      return this.jobSyncStatusModel.updateOne(
        {
          k,
        },
        {
          n: !isNaN(status?.n) ? ++status.n : 1,
          e: error?.toString(),
          s: false,
          meta: {
            error,
          },
          date: moment().toDate(),
        },
        {
          upsert: true,
          strict: false,
        },
      );
    }
  }

  saveInfo(id: string, meta: any) {
    const info = this.getInfo(id);

    if (info) {
      info.meta = meta;
    } else {
      JobSyncStatusService.INFOS.push({
        id,
        meta,
      });
    }
  }

  getInfo(id: string) {
    return JobSyncStatusService.INFOS.find((_i) => _i.id === id);
  }
}
