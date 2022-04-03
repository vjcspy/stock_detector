import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Document } from 'mongoose';

export type JobResultDocument = JobResult & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
})
export class JobResult {
  @Prop({ isRequired: false })
  jobId: string;

  @Prop({ isRequired: false })
  jobKey: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  result?: Record<string, any>;
}

export const JobResultSchema = SchemaFactory.createForClass(JobResult);
