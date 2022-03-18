import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LogDbDocument = LogDb & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class LogDb {
  @Prop({ isRequired: false })
  source: string;

  @Prop({ isRequired: false })
  group: string;

  @Prop({ isRequired: false })
  group1: string;

  @Prop({ isRequired: false })
  group2: string;

  @Prop({ isRequired: false })
  group3: string;

  @Prop({ isRequired: false })
  message: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata: Record<string, any>;
}

export const LogDbSchema = SchemaFactory.createForClass(LogDb);
