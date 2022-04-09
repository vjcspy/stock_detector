import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type JobSyncStatusDocument = JobSyncStatus & Document;

export class JobSyncStatus {
  // key
  @Prop({ isRequired: true, index: true })
  k: string;

  // success
  @Prop({ isRequired: true, type: mongoose.Schema.Types.Boolean })
  s: boolean;

  // number of try syncs
  @Prop({ isRequired: false, type: mongoose.Schema.Types.Number })
  n: number;

  // Error
  @Prop({ isRequired: false })
  e?: string;

  @Prop({
    isRequired: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now,
    index: true,
  })
  date: Date;

  @Prop({ isRequired: true, type: mongoose.Schema.Types.Mixed })
  meta: any;
}

export const JobSyncStatusSchema = SchemaFactory.createForClass(JobSyncStatus);
