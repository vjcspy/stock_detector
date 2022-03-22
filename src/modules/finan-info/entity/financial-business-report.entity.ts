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
export class FinancialBusinessReportEntity extends BaseEntity {
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

  // Doanh thu bán hàng và cung cấp dịch vụ
  @Column({
    type: 'int',
    nullable: true,
  })
  revenue: number;

  // Các khoản giảm trừ doanh thu
  @Column({
    type: 'int',
    nullable: true,
  })
  deductionFromRevenue: number;

  // Doanh thu thuần về bán hàng và cung cấp dịch vụ
  @Column({
    type: 'int',
    nullable: true,
  })
  netRevenue: number;

  // Giá vốn hàng bán
  @Column({
    type: 'int',
    nullable: true,
  })
  costOfGoodsSold: number;

  // Lợi nhuận gộp về bán hàng và cung cấp dịch vụ
  @Column({
    type: 'int',
    nullable: true,
  })
  grossProfit: number;

  // Doanh thu hoạt động tài chính
  @Column({
    type: 'int',
    nullable: true,
  })
  financialIncome: number;

  // Chi phí tài chính
  @Column({
    type: 'int',
    nullable: true,
  })
  financialExpenses: number;

  // Chi phí lãi vay
  @Column({
    type: 'int',
    nullable: true,
  })
  interestExpenses: number;

  // Phần lãi/lỗ trong công ty liên doanh, liên kết
  @Column({
    type: 'int',
    nullable: true,
  })
  shareOfAssociatesAndJointVenturesResult: number;

  // Chi phí bán hàng
  @Column({
    type: 'int',
    nullable: true,
  })
  sellingExpenses: number;

  // Chi phí quản lý doanh nghiệp
  @Column({
    type: 'int',
    nullable: true,
  })
  generalAndAdministrativeExpenses: number;

  // Lợi nhuận thuần từ hoạt động kinh doanh
  @Column({
    type: 'int',
    nullable: true,
  })
  operatingProfit: number;

  // Thu nhập khác
  @Column({
    type: 'int',
    nullable: true,
  })
  otherIncome: number;

  // Chi phí khác
  @Column({
    type: 'int',
    nullable: true,
  })
  otherExpenses: number;

  // Lợi nhuận khác
  @Column({
    type: 'int',
    nullable: true,
  })
  otherProfit: number;

  // Phần lợi nhuận/lỗ từ công ty liên kết liên doanh
  @Column({
    type: 'int',
    nullable: true,
  })
  shareOfAssociatesAndJointVentures: number;

  // Tổng lợi nhuận kế toán trước thuế
  @Column({
    type: 'int',
    nullable: true,
  })
  profitBeforeTax: number;

  // Chi phí thuế TNDN hiện hành
  @Column({
    type: 'int',
    nullable: true,
  })
  currentCorporateIncomeTaxExpenses: number;

  // Chi phí thuế TNDN hoãn lại
  @Column({
    type: 'int',
    nullable: true,
  })
  deferredIncomeTaxExpenses: number;

  // Lợi nhuận sau thuế thu nhập doanh nghiệp
  @Column({
    type: 'int',
    nullable: true,
  })
  netProfitAfterTax: number;

  // Lợi ích của cổ đông thiểu số
  @Column({
    type: 'int',
    nullable: true,
  })
  minorityInterest: number;

  // Lợi nhuận sau thuế của cổ đông của Công ty mẹ
  @Column({
    type: 'int',
    nullable: true,
  })
  profitAfterTaxForShareholdersOfParentCompany: number;

  // Lãi cơ bản trên cổ phiếu (*) (VNÐ)
  @Column({
    type: 'int',
    nullable: true,
  })
  earningsPerShare: number;

  // Lãi suy giảm trên cổ phiếu (*)
  @Column({
    type: 'int',
    nullable: true,
  })
  dilutedEarningsPerShare: number;

  /*--------------------------------------------------------------------------*/
}
