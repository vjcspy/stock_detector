import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type OrderMatchingDocument = OrderMatching & Document;

/*
 * Có 2 kiểu là lấy theo lịch sử,
 * hoặc là phân loại theo nhà đầu tư, hay ho ở chỗ là techcombank nó group các lệnh theo người đặt
 * */
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

  /*
   * Ngày lấy từ dữ liệu trả về
   * */
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
