import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import moment from 'moment';

export type AsyncResultDocument = AsyncResult & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
})
export class AsyncResult {
  @Prop({ isRequired: true, type: mongoose.Schema.Types.String, index: true })
  key: string;

  @Prop({ isRequired: true, type: mongoose.Schema.Types.Mixed })
  data: Record<string, any>;
}
