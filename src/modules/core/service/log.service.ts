import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Levels,
  LogDb,
  LogDbDocument,
} from '@module/core/schemas/log-db.schema';
import { Model } from 'mongoose';
import { initDefaultLogger } from '@module/core/util/logfile';
import winston from 'winston';
import moment from 'moment';
import process from 'process';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(LogDb.name) private logDbModel: Model<LogDbDocument>,
  ) {}

  public async log(
    record: LogDb,
    options: {
      console?: boolean;
      file?: boolean;
    } = {
      console: true,
    },
  ): Promise<void> {
    try {
      if (typeof record?.level === 'undefined') {
        record.level = Levels.info;
      }
      const _logger = initDefaultLogger();
      if (options?.console) {
        _logger.add(new winston.transports.Console({}));
      }

      if (options?.console || options?.file) {
        const msg = `${process.pid} ${moment().format(
          'YYYY-MM-DD, HH:mm:ss ',
        )} [${record.source}|${record.group}${this._s(record?.group1)}${this._s(
          record?.group2,
        )}${this._s(record?.group3)}] : ${record.message}`;
        _logger.log(record.level, msg);
      }

      const createdCat = new this.logDbModel(record);
      await createdCat.save();
    } catch (e) {}
  }

  protected _s(text: string) {
    return text ? '|' + text : '';
  }
}
