import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CronStatus,
  CronStatusDocument,
} from '@module/core/schemas/cron-status.schema';
import { Model } from 'mongoose';

@Injectable()
export class CronStatusService {
  constructor(
    @InjectModel(CronStatus.name)
    public cronStatusModel: Model<CronStatusDocument>,
  ) {}
}
