import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['code', 'periodBegin', 'periodEnd'])
export class FinancialIndicatorsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: '10',
  })
  code: string;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  quarter: number;

  @Column({
    type: 'smallint',
  })
  year: number;

  @Column({
    type: 'tinyint',
  })
  termType: number;

  @Column({
    type: 'varchar',
    length: '6',
    nullable: true,
  })
  periodBegin: string;

  @Column({
    type: 'varchar',
    length: '6',
    nullable: true,
  })
  periodEnd: string;

  // HN: hợp nhất / ĐL: Đơn lẻ / CTM: công ty mẹ
  @Column({
    type: 'varchar',
    length: '3',
    nullable: true,
  })
  united: string;

  // CKT: Chưa kiểm toán / SX: Soát xét / KT: Kiểm toán
  @Column({
    type: 'varchar',
    length: '3',
  })
  auditedStatus: string;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  eps: number;

  // Giá trị sổ sách
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  bvps: number;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  pe: number;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  pb: number;

  // Tỷ suất lợi nhuận gộp biên
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  grossProfitMargin: number;

  // Tỷ suất lợi nhuận trên doanh thu thuần
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  netProfitMargin: number;

  // Tỷ suất lợi nhuận trên vốn chủ sở hữu bình quân
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  roea: number;

  // Tỷ suất lợi nhuận trên tổng tài sản bình quân
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  roaa: number;

  // Tỷ sổ thanh toán hiện hành ngắn hạn
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermRatio: number;

  // Khả năng thanh toán lãi vay
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  interestCoverage: number;

  // Tỷ số nợ trên tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  liabilitiesToAssets: number;

  // Tỷ số nợ vay trên VCSH
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  debtToEquity: number;
}
