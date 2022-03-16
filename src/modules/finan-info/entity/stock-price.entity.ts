import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import {
  EntityWithSourceMapping,
  SourceMapping,
} from '@module/core/decorator/entity/source-mapping/entity-with-source-mapping';

@EntityWithSourceMapping
@Entity()
@Unique(['code', 'date'])
export class StockPriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @SourceMapping('Symbol')
  @Column({
    nullable: false,
    type: 'varchar',
    length: '10',
  })
  code: string;

  @SourceMapping('Date', (data: any) => {
    return new Date(data['Date']);
  })
  @Column({
    type: 'date',
    nullable: false,
  })
  date: Date;

  /**
   * ------------------------- Giá điều chỉnh
   */

  @SourceMapping('AdjClose')
  @Column('mediumint')
  adClose: number;

  @SourceMapping('AdjHigh')
  @Column('mediumint')
  adHigh: number;

  @SourceMapping('AdjLow')
  @Column('mediumint')
  adLow: number;

  @SourceMapping('AdjOpen')
  @Column('mediumint')
  adOpen: number;

  @SourceMapping('AdjRatio')
  @Column('decimal', { precision: 8, scale: 3 })
  adRatio: number;

  /**
   * ------------------------- Mua
   */
  @SourceMapping('BuyAvg')
  @Column('decimal', { precision: 10, scale: 3 })
  buyAvg: number;

  // Số lệnh đặt mua
  @SourceMapping('BuyCount')
  @Column('int', { unsigned: true })
  buyCount: number;

  // KL đặt mua
  @SourceMapping('BuyQuantity')
  @Column('int', { unsigned: true })
  buyQuantity: number;

  /**
   * Nước ngoài mua
   */
  @SourceMapping('BuyForeignQuantity')
  @Column('int', { unsigned: true })
  buyForeignQuantity: number;

  @SourceMapping('BuyForeignValue')
  @Column('bigint', { unsigned: true })
  buyForeignValue: number;

  @SourceMapping('CurrentForeignRoom')
  @Column('int', { unsigned: true, default: 0 })
  currentForeignRoom: number;

  /**
   * ------------------------- Thông tin khác
   */
  @SourceMapping('DealVolume')
  @Column('int', { unsigned: true, default: 0 })
  dealVolume: number;

  @SourceMapping('Exchange')
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  exchange: number;

  @SourceMapping('MarketCap')
  @Column('int', { unsigned: true, default: 0 })
  marketCap: number;

  @SourceMapping('PricePreviousClose')
  @Column('int', { unsigned: true, default: 0 })
  pricePreviousClose: number;

  @SourceMapping('PutThroughValue')
  @Column('bigint', { unsigned: true, default: 0, nullable: true })
  putThroughValue: number;

  @SourceMapping('PutThroughVolume')
  @Column('int', { unsigned: true, default: 0, nullable: true })
  putThroughVolume: number;

  @SourceMapping('Shares')
  @Column('int', { unsigned: true, default: 0, nullable: true })
  shares: number;

  /**
   * ------------------------- Giá
   */
  @SourceMapping('PriceAverage')
  @Column('decimal', { precision: 10, scale: 3 })
  priceAverage: number;

  @SourceMapping('PriceBasic')
  @Column('int', { unsigned: true })
  priceBasic: number;

  @SourceMapping('PriceClose')
  @Column('int', { unsigned: true })
  priceClose: number;

  @SourceMapping('PriceHigh')
  @Column('int', { unsigned: true })
  priceHigh: number;

  @SourceMapping('PriceLow')
  @Column('int', { unsigned: true })
  priceLow: number;

  @SourceMapping('PriceOpen')
  @Column('int', { unsigned: true })
  priceOpen: number;

  /**
   * ------------------------- Bán
   */
  @SourceMapping('SellAvg')
  @Column('decimal', { precision: 10, scale: 3 })
  sellAvg: number;

  // Số lệnh đặt mua
  @SourceMapping('SellCount')
  @Column('int', { unsigned: true })
  sellCount: number;

  // KL đặt mua
  @SourceMapping('SellQuantity')
  @Column('int', { unsigned: true })
  sellQuantity: number;

  /**
   * Nước ngoài bán
   */
  @SourceMapping('SellForeignQuantity')
  @Column('int', { unsigned: true })
  sellForeignQuantity: number;

  @SourceMapping('SellForeignValue')
  @Column('bigint', { unsigned: true })
  sellForeignValue: number;

  /**
   * ------------------------- Khớp lệnh
   */
  @SourceMapping('TotalTrade')
  @Column('bigint', { unsigned: true })
  totalTrade: number;

  @SourceMapping('TotalValue')
  @Column('bigint', { unsigned: true })
  totalValue: number;

  @SourceMapping('TotalVolume')
  @Column('int', { unsigned: true })
  totalVolume: number;

  @SourceMapping('Volume')
  @Column('int', { unsigned: true })
  volume: number;
}
