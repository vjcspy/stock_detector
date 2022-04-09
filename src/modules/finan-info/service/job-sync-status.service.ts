import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  JobSyncStatus,
  JobSyncStatusDocument,
} from '@module/finan-info/schema/job-sync-status.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobSyncStatusService {
  static INFOS: { id: string; meta: any }[] = [];
  constructor(
    @InjectModel(JobSyncStatus.name)
    private jobSyncStatusModel: Model<JobSyncStatusDocument>,
  ) {}

  async getStatus(code: string, syncType: string) {
    return this.jobSyncStatusModel.findOne({
      code,
      t: syncType,
    });
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
