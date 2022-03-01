import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['code', 'date'])
export class StockPriceEntity {
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

  @Column('decimal', { precision: 8, scale: 3 })
  change: number;

  @Column('decimal', { precision: 8, scale: 3 })
  adAverage: number;

  @Column('decimal', { precision: 8, scale: 3 })
  adChange: number;

  @Column('decimal', { precision: 8, scale: 3 })
  adClose: number;

  @Column('decimal', { precision: 8, scale: 3 })
  adHigh: number;

  @Column('decimal', { precision: 8, scale: 3 })
  adLow: number;

  @Column('decimal', { precision: 8, scale: 3 })
  adOpen: number;

  @Column('decimal', { precision: 8, scale: 3 })
  average: number;

  @Column('decimal', { precision: 8, scale: 3 })
  basicPrice: number;

  @Column('decimal', { precision: 8, scale: 3 })
  ceilingPrice: number;

  @Column('decimal', { precision: 8, scale: 3 })
  close: number;

  @Column('decimal', { precision: 8, scale: 3 })
  open: number;

  @Column('decimal', { precision: 8, scale: 3 })
  floorPrice: number;

  @Column('decimal', { precision: 8, scale: 3 })
  high: number;

  @Column('decimal', { precision: 8, scale: 3 })
  low: number;

  @Column({
    type: 'bigint',
  })
  nmValue: number;

  @Column({
    type: 'int',
  })
  nmVolume: number;

  @Column({
    type: 'float',
    unsigned: false,
  })
  pctChange: number;

  @Column()
  floor: string;

  @Column()
  type: string;
}
