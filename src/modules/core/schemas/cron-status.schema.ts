import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';

export type CronStatusDocument = CronStatus & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
    currentTime: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
})
export class CronStatus {
  @Prop({ isRequired: false, index: true })
  cronId: string;

  @Prop({ isRequired: false })
  jobKey: string;

  @Prop()
  status?: string;
}

export const CronStatusSchema = SchemaFactory.createForClass(CronStatus);
