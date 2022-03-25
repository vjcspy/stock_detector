import { Prop, Schema } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose from 'mongoose';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
})
export class JobResultSchema {
  @Prop({ isRequired: false })
  jobKey: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  result?: Record<string, any>;
}
