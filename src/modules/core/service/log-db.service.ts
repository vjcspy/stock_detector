import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogDb, LogDbDocument } from '@module/core/schemas/log-db.schema';
import { Model } from 'mongoose';

@Injectable()
export class LogDbService {
  constructor(
    @InjectModel(LogDb.name) private logDbModel: Model<LogDbDocument>,
  ) {}
}
