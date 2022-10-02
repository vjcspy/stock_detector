import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
} from 'typeorm';

@Entity()
@Unique(['code', 'lastDate'])
export class StockPriceSyncStatusEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: '10',
    unique: true,
  })
  code: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  lastDate?: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  lastUpdateDate: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  lastError?: string;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  try?: number;
}
