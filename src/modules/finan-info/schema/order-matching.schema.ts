import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import moment from 'moment';

export type OrderMatchingDocument = OrderMatching & Document;

export enum OrderMatchingType {
  HISTORY = 0,
  INVESTOR = 1,
}

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class OrderMatching {
  @Prop({ isRequired: true, index: true })
  code: string;

  @Prop({ isRequired: true, type: mongoose.Schema.Types.Number })
  type: OrderMatchingType;

  @Prop({
    isRequired: true,
    type: mongoose.Schema.Types.Date,
    index: true,
  })
  date: Date;

  @Prop({ isRequired: true, type: mongoose.Schema.Types.Mixed })
  meta: any;
}

export const OrderMatchingSchema = SchemaFactory.createForClass(OrderMatching);
