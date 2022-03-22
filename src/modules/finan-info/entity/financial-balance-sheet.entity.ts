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
import * as _ from 'lodash';

const convertSourceFn = (sourceId: number) => {
  return (sourceData: any) => {
    const data = _.find(sourceData, (value) => value?.ID == sourceId);

    return data &&
      typeof data['value'] !== 'undefined' &&
      parseFloat(data['value']) < 1000000 &&
      parseFloat(data['value']) > -1000000
      ? data['value']
      : null;
  };
};

@EntityWithSourceMapping
@Entity()
@Unique(['code', 'periodBegin', 'periodEnd'])
export class FinancialBalanceSheetEntity extends BaseEntity {
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

  /*--------------------------------------------------------------------------*/
}
