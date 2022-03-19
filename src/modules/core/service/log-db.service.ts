import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogDb, LogDbDocument } from '@module/core/schemas/log-db.schema';
import { Model } from 'mongoose';

enum Levels {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export interface LogRecord {
  source: string;
  level?: Levels;
  group: string;
  group1?: string;
  group2?: string;
  group3?: string;
  message: string;
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
