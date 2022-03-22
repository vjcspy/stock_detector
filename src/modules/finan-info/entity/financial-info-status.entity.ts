import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum FinancialInfoType {
  INDICATOR = 'CSTC',
  BALANCE_SHEET = 'CDKT',
  BUSINESS_REPORT = 'KQKD',
  CASH_FLOW = 'LCTT',
}

export enum FinancialTermTypeEnum {
  YEAR = 1,
  QUARTER = 2,
}

@Entity()
@Unique(['code', 'termType', 'type'])
export class FinancialInfoStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: '10',
  })
  code: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: '4',
  })
  type: FinancialInfoType;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  termType: number;

  @Column({
    type: 'varchar',
    length: '4',
    nullable: false,
  })
  year: string;

  @Column({
    type: 'varchar',
    length: '1',
    nullable: true,
  })
  quarter: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  error: string;
}
