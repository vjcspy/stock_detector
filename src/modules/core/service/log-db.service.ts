import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogDb, LogDbDocument } from '@module/core/schemas/log-db.schema';
import { Model } from 'mongoose';

export interface LogRecord {
  source: string;
  message: string;
  group: string;
  group1?: string;
  group2?: string;
  group3?: string;
  metadata?: any;
}

@Injectable()
export class LogDbService {
  constructor(
    @InjectModel(LogDb.name) private logDbModel: Model<LogDbDocument>,
  ) {}

  public log(record: LogRecord) {
    console.log(record);
  }
}
