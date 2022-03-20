import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Levels,
  LogDb,
  LogDbDocument,
} from '@module/core/schemas/log-db.schema';
import { Model } from 'mongoose';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(LogDb.name) private logDbModel: Model<LogDbDocument>,
  ) {}

  /**
   *
   * @param record
   * @param withConsole
   * @returns {Promise<LogDb & Document<any, any, any> & {_id: (LogDb & Document<any, any, any>)["_id"]}>}
   */
  public log(record: LogDb, withConsole = true) {
    if (typeof record?.level === 'undefined') {
      record.level = Levels.info;
    }
    const createdCat = new this.logDbModel(record);
    return createdCat.save();
  }
}
