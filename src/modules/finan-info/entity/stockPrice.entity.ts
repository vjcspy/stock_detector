import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { entityWithSourceMapping } from '@module/core/decorator/entity/entity-with-source-mapping';

@Entity()
@Unique(['code', 'date'])
@entityWithSourceMapping
export class StockPriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: '10',
  })
  code: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: Date;

  /**
   * ------------------------- Giá điều chỉnh
   */

  @Column('mediumint')
  adClose: number;

  @Column('mediumint')
  adHigh: number;

  @Column('mediumint')
  adLow: number;

  @Column('mediumint')
  adOpen: number;

  @Column('decimal', { precision: 8, scale: 3 })
  adRatio: number;

  /**
   * ------------------------- Mua
   */
  @Column('decimal', { precision: 10, scale: 3 })
  buyAvg: number;

  // Số lệnh đặt mua
  @Column('int', { unsigned: true })
  buyCount: number;

  // KL đặt mua
  @Column('int', { unsigned: true })
  buyQuantity: number;

  /**
   * Nước ngoài mua
   */
  @Column('int', { unsigned: true })
  buyForeignQuantity: number;

  @Column('int', { unsigned: true })
  buyForeignValue: number;

  @Column('int', { unsigned: true })
  currentForeignRoom: number;

  /**
   * ------------------------- Thông tin khác
   */
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  dealVolume: number;

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  exchange: number;

  @Column('int', { nullable: true })
  mảtketCap: number;

  @Column('int', { unsigned: true })
  pricePreviousClose: number;

  @Column('int', { unsigned: true })
  putthroughValue: number;

  @Column('int', { unsigned: true })
  putthroughVolume: number;

  @Column('int', { unsigned: true })
  shares: number;

  /**
   * ------------------------- Giá
   */
  @Column('decimal', { precision: 10, scale: 3 })
  priceAverage: number;

  @Column('int', { unsigned: true })
  priceBasic: number;

  @Column('int', { unsigned: true })
  priceClose: number;

  @Column('int', { unsigned: true })
  priceHigh: number;

  @Column('int', { unsigned: true })
  priceLow: number;

  @Column('int', { unsigned: true })
  priceOpen: number;

  /**
   * ------------------------- Bán
   */
  @Column('decimal', { precision: 10, scale: 3 })
  sellAvg: number;

  // Số lệnh đặt mua
  @Column('int', { unsigned: true })
  sellCount: number;

  // KL đặt mua
  @Column('int', { unsigned: true })
  sellQuantity: number;

  /**
   * Nước ngoài bán
   */
  @Column('int', { unsigned: true })
  sellForeignQuantity: number;

  @Column('int', { unsigned: true })
  sellForeignValue: number;

  /**
   * ------------------------- Khớp lệnh
   */
  @Column('int', { unsigned: true })
  totalTrade: number;

  @Column('int', { unsigned: true })
  totalValue: number;

  @Column('int', { unsigned: true })
  totalVolume: number;

  @Column('int', { unsigned: true })
  volume: number;
}
