import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import 'moment-timezone';

export type LogDbDocument = LogDb & Document;

export enum Levels {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
})
export class LogDb {
  @Prop({ isRequired: false })
  source: string;

  @Prop({ isRequired: true })
  level?: Levels;

  @Prop({ isRequired: false })
  group: string;

  @Prop({ isRequired: false })
  group1?: string;

  @Prop({ isRequired: false })
  group2?: string;

  @Prop({ isRequired: false })
  group3?: string;

  @Prop({ isRequired: false })
  message: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata?: Record<string, any>;
}

export const LogDbSchema = SchemaFactory.createForClass(LogDb);
