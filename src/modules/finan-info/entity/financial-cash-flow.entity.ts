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
export class FinancialCashFlowEntity extends BaseEntity {
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

  // Lưu chuyển tiền từ hoạt động kinh doanh
  @SourceMapping(null, convertSourceFn(1))
  @Column({
    type: 'int',
    nullable: true,
  })
  cashFlowsFromOperatingActivities: number;

  // Lợi nhuận trước thuế
  @SourceMapping(null, convertSourceFn(2))
  @Column({
    type: 'int',
    nullable: true,
  })
  profitBeforeTax: number;

  // Điều chỉnh cho các khoản
  @SourceMapping(null, convertSourceFn(3))
  @Column({
    type: 'int',
    nullable: true,
  })
  adjustmentsFor: number;

  // Khấu hao TSCĐ và BĐSĐT
  @SourceMapping(null, convertSourceFn(4))
  @Column({
    type: 'int',
    nullable: true,
  })
  depreciationOfFixedAssetsAndPropertiesInvestment: number;

  // Các khoản dự phòng
  @SourceMapping(null, convertSourceFn(5))
  @Column({
    type: 'int',
    nullable: true,
  })
  reversalOfProvisionsOverProvisions: number;

  // Lãi, lỗ chênh lệch tỷ giá hối đoái do đánh giá lại các khoản mục tiền tệ có gốc ngoại tệ
  @SourceMapping(null, convertSourceFn(6))
  @Column({
    type: 'int',
    nullable: true,
  })
  foreignxEchangeGainLoss: number;

  // Lãi, lỗ từ hoạt động đầu tư
  @SourceMapping(null, convertSourceFn(7))
  @Column({
    type: 'int',
    nullable: true,
  })
  lossProfitFromInvestmentActivities: number;

  // Chi phí lãi vay
  @SourceMapping(null, convertSourceFn(8))
  @Column({
    type: 'int',
    nullable: true,
  })
  interestExpense: number;

  // Lãi, lỗ từ thanh lý TSCĐ
  @SourceMapping(null, convertSourceFn(9))
  @Column({
    type: 'int',
    nullable: true,
  })
  lossProfitsFromDisposalOfFixedAsset: number;

  // Thu nhập lãi vay và cổ tức
  @SourceMapping(null, convertSourceFn(10))
  @Column({
    type: 'int',
    nullable: true,
  })
  interestIncomeAndDividends: number;

  // Phân bổ lợi thế thương mại
  @SourceMapping(null, convertSourceFn(11))
  @Column({
    type: 'int',
    nullable: true,
  })
  allocationOfGoodwill: number;

  // Điều chỉnh cho các khoản khác
  @SourceMapping(null, convertSourceFn(12))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherAdjustmentsFor: number;

  // Lợi nhuận từ hoạt động kinh doanh trước thay đổi vốn lưu động
  @SourceMapping(null, convertSourceFn(13))
  @Column({
    type: 'int',
    nullable: true,
  })
  operatingProfitBeforeChangesInWorkingCapital: number;

  // Tăng, giảm các khoản phải thu
  @SourceMapping(null, convertSourceFn(14))
  @Column({
    type: 'int',
    nullable: true,
  })
  increaseDecreaseInReceivables: number;

  // Tăng, giảm hàng tồn kho
  @SourceMapping(null, convertSourceFn(15))
  @Column({
    type: 'int',
    nullable: true,
  })
  increaseDecreaseInInventories: number;

  // Tăng, giảm các khoản phải trả (không kể lãi vay phải trả, thuế thu nhập phải nộp)
  @SourceMapping(null, convertSourceFn(16))
  @Column({
    type: 'int',
    nullable: true,
  })
  increaseDecreaseInPayables: number;

  // Tăng, giảm chi phí trả trước
  @SourceMapping(null, convertSourceFn(17))
  @Column({
    type: 'int',
    nullable: true,
  })
  increaseDecreaseInPrepaidExpenses: number;

  // Tăng, giảm chứng khoán kinh doanh
  @SourceMapping(null, convertSourceFn(18))
  @Column({
    type: 'int',
    nullable: true,
  })
  changesInAvailableForSaleSecurities: number;

  // Tiền lãi vay đã trả
  @SourceMapping(null, convertSourceFn(19))
  @Column({
    type: 'int',
    nullable: true,
  })
  interestPaid: number;

  // Thuế thu nhập doanh nghiệp đã nộp
  @SourceMapping(null, convertSourceFn(20))
  @Column({
    type: 'int',
    nullable: true,
  })
  corporateIncomeTaxPaid: number;

  // Tiền thu khác từ hoạt động kinh doanh
  @SourceMapping(null, convertSourceFn(21))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherReceiptsFromOperatingActivities: number;

  // Tiền chi khác cho hoạt động kinh doanh
  @SourceMapping(null, convertSourceFn(22))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherPaymentsForOperatingActivities: number;

  // Lưu chuyển tiền thuần từ hoạt động kinh doanh
  @SourceMapping(null, convertSourceFn(23))
  @Column({
    type: 'int',
    nullable: true,
  })
  netCashFlowsFromOperatingActivities: number;

  // Lưu chuyển tiền từ hoạt động đầu tư
  @SourceMapping(null, convertSourceFn(24))
  @Column({
    type: 'int',
    nullable: true,
  })
  cashFlowsFromInvestingActivities: number;

  // Tiền chi để mua sắm, xây dựng TSCĐ và các tài sản dài hạn khác
  @SourceMapping(null, convertSourceFn(25))
  @Column({
    type: 'int',
    nullable: true,
  })
  paymentForFixedAssets: number;

  // Tiền thu từ thanh lý, nhượng bán TSCĐ và các tài sản dài hạn khác
  @SourceMapping(null, convertSourceFn(26))
  @Column({
    type: 'int',
    nullable: true,
  })
  receiptsFromDisposalOfFixedAssets: number;

  // Tiền chi cho vay, mua các công cụ nợ của đơn vị khác
  @SourceMapping(null, convertSourceFn(27))
  @Column({
    type: 'int',
    nullable: true,
  })
  loansPurchasesOfOtherEntities: number;

  // Tiền thu hồi cho vay, bán lại các công cụ nợ của đơn vị khác
  @SourceMapping(null, convertSourceFn(28))
  @Column({
    type: 'int',
    nullable: true,
  })
  receiptsFromLoanRepayments: number;

  // Tiền chi đầu tư góp vốn vào đơn vị khác
  @SourceMapping(null, convertSourceFn(29))
  @Column({
    type: 'int',
    nullable: true,
  })
  paymentsForInvestmentInOtherEntities: number;

  // Tiền thu hồi đầu tư góp vốn vào đơn vị khác
  @SourceMapping(null, convertSourceFn(30))
  @Column({
    type: 'int',
    nullable: true,
  })
  collectionsOnInvestmentInOtherEntities: number;

  // Tiền thu lãi cho vay, cổ tức và lợi nhuận được chia
  @SourceMapping(null, convertSourceFn(31))
  @Column({
    type: 'int',
    nullable: true,
  })
  dividendsInterestAndProfit: number;

  // Tăng giảm tiền gửi ngân hàng có kỳ hạn
  @SourceMapping(null, convertSourceFn(32))
  @Column({
    type: 'int',
    nullable: true,
  })
  increaseDecreaseInTermDeposit: number;

  // Mua lại khoản góp vốn của cổ đông thiểu số trong công ty con
  @SourceMapping(null, convertSourceFn(33))
  @Column({
    type: 'int',
    nullable: true,
  })
  purchasesOfMinoritySharesOfSubsidiaries: number;

  // Tiền thu khác từ hoạt động đầu tư
  @SourceMapping(null, convertSourceFn(34))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherReceiptsFromInvestingActivities: number;

  // Tiền chi khác cho hoạt động đầu tư
  @SourceMapping(null, convertSourceFn(35))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherPaymentsForInvestingActivities: number;

  // Lưu chuyển tiền thuần từ hoạt động đầu tư
  @SourceMapping(null, convertSourceFn(36))
  @Column({
    type: 'int',
    nullable: true,
  })
  netCashFlowsFromInvestingActivities: number;

  // Lưu chuyển tiền từ hoạt động tài chính
  @SourceMapping(null, convertSourceFn(37))
  @Column({
    type: 'int',
    nullable: true,
  })
  cashFlowsFromFinancingActivities: number;

  // Tiền thu từ phát hành cổ phiếu, nhận vốn góp của chủ sở hữu
  @SourceMapping(null, convertSourceFn(38))
  @Column({
    type: 'int',
    nullable: true,
  })
  receiptsFromEquityIssue: number;

  // Tiền chi trả vốn góp cho các chủ sở hữu, mua lại cổ phiếu của doanh nghiệp đã phát hành
  @SourceMapping(null, convertSourceFn(39))
  @Column({
    type: 'int',
    nullable: true,
  })
  paymentForShareRepurchases: number;

  // Tiền thu từ đi vay
  @SourceMapping(null, convertSourceFn(40))
  @Column({
    type: 'int',
    nullable: true,
  })
  proceedsFromBorrowings: number;

  // Tiền trả nợ gốc vay
  @SourceMapping(null, convertSourceFn(41))
  @Column({
    type: 'int',
    nullable: true,
  })
  principalRepayments: number;

  // Tiền trả nợ gốc thuê tài chính
  @SourceMapping(null, convertSourceFn(42))
  @Column({
    type: 'int',
    nullable: true,
  })
  repaymentOfFinancialLeases: number;

  // Cổ tức, lợi nhuận đã trả cho chủ sở hữu
  @SourceMapping(null, convertSourceFn(43))
  @Column({
    type: 'int',
    nullable: true,
  })
  dividendsPaidProfitsDistributedToOwners: number;

  // Tiền thu khác từ hoạt động tài chính
  @SourceMapping(null, convertSourceFn(44))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherReceiptsFromFinancingActivities: number;

  // Tiền chi khác cho hoạt động tài chính
  @SourceMapping(null, convertSourceFn(45))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherPaymentsForFinancingActivities: number;

  // Lưu chuyển tiền thuần từ hoạt động tài chính
  @SourceMapping(null, convertSourceFn(46))
  @Column({
    type: 'int',
    nullable: true,
  })
  netCashFlowsFromFinancingActivities: number;

  // Lưu chuyển tiền thuần trong kỳ
  @SourceMapping(null, convertSourceFn(47))
  @Column({
    type: 'int',
    nullable: true,
  })
  netCashFlowsDuringThePeriod: number;

  // Tiền và tương đương tiền đầu kỳ
  @SourceMapping(null, convertSourceFn(48))
  @Column({
    type: 'int',
    nullable: true,
  })
  cashAndCashEquivalents: number;

  // Ảnh hưởng của thay đổi tỷ giá hối đoái quy đổi ngoại tệ
  @SourceMapping(null, convertSourceFn(49))
  @Column({
    type: 'int',
    nullable: true,
  })
  exchangeDifferenceDue: number;

  // Tiền và tương đương tiền cuối kỳ
  @SourceMapping(null, convertSourceFn(50))
  @Column({
    type: 'int',
    nullable: true,
  })
  cashAndCashEquivalentsAtEnd: number;
  /*--------------------------------------------------------------------------*/
}
