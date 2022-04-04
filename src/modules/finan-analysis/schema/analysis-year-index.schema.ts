import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Document } from 'mongoose';

export type AnalysisYearIndexDocument = AnalysisYearIndex & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: () => moment().tz('Asia/Ho_Chi_Minh').toDate(),
  },
})
export class AnalysisYearIndex {
  @Prop({ isRequired: true, type: mongoose.Schema.Types.String, index: true })
  code: string;

  @Prop({ isRequired: true, type: mongoose.Schema.Types.String, index: true })
  analysis_code: string;

  @Prop({ isRequired: false, type: mongoose.Schema.Types.Number, index: true })
  t1: number;

  @Prop({ isRequired: false, type: mongoose.Schema.Types.Number })
  t2: number;

  @Prop({ isRequired: false, type: mongoose.Schema.Types.Number })
  t3: number;

  @Prop({ isRequired: false, type: mongoose.Schema.Types.Number })
  t4: number;

  @Prop({ isRequired: false, type: mongoose.Schema.Types.Number })
  t5: number;

  @Prop({ isRequired: false, type: mongoose.Schema.Types.Number })
  sd: number;
}

export const AnalysisYearIndexSchema =
  SchemaFactory.createForClass(AnalysisYearIndex);
