import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CronScheduleDocument = CronSchedule & Document;

export enum CronScheduleStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
}

@Schema({
  timestamps: false,
})
export class CronSchedule {
  @Prop({ isRequired: false, index: true })
  jobCode: string;

  @Prop()
  status?: CronScheduleStatus;

  @Prop({ type: mongoose.Schema.Types.Date })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  finished_at: Date;
}

export const CronScheduleSchema = SchemaFactory.createForClass(CronSchedule);
