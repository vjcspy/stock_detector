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

    return data?.value ?? null;
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

  // TÀI SẢN
  @SourceMapping(null, convertSourceFn(1))
  @Column({
    type: 'int',
    nullable: true,
  })
  assets: number;

  // TÀI SẢN NGẮN HẠN
  @SourceMapping(null, convertSourceFn(2))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermAssets: number;

  // Tiền và các khoản tương đương tiền
  @SourceMapping(null, convertSourceFn(3))
  @Column({
    type: 'int',
    nullable: true,
  })
  cashAndCashEquivalents: number;

  // Tiền
  @SourceMapping(null, convertSourceFn(4))
  @Column({
    type: 'int',
    nullable: true,
  })
  cash: number;

  // Các khoản tương đương tiền
  @SourceMapping(null, convertSourceFn(5))
  @Column({
    type: 'int',
    nullable: true,
  })
  cashEquivalents: number;

  // Đầu tư tài chính ngắn hạn
  @SourceMapping(null, convertSourceFn(6))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermFinancialInvestments: number;

  // Chứng khoán kinh doanh
  @SourceMapping(null, convertSourceFn(7))
  @Column({
    type: 'int',
    nullable: true,
  })
  availableForSaleSecurities: number;

  // Dự phòng giảm giá chứng khoán kinh doanh (*)
  @SourceMapping(null, convertSourceFn(8))
  @Column({
    type: 'int',
    nullable: true,
  })
  availableForSaleSecurity: number;

  // Đầu tư nắm giữ đến ngày đáo hạn
  @SourceMapping(null, convertSourceFn(9))
  @Column({
    type: 'int',
    nullable: true,
  })
  heldToMaturityInvestments: number;

  // Các khoản phải thu ngắn hạn
  @SourceMapping(null, convertSourceFn(10))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermReceivables: number;

  // Phải thu ngắn hạn của khách hàng
  @SourceMapping(null, convertSourceFn(11))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermTradeAccountsReceivable: number;

  // Trả trước cho người bán ngắn hạn
  @SourceMapping(null, convertSourceFn(12))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermPrepaymentsToSuppliers: number;

  // Trả trước cho người bán ngắn hạn
  @SourceMapping(null, convertSourceFn(13))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermInterCompanyReceivables: number;

  // Phải thu theo tiến độ kế hoạch hợp đồng xây dựng
  @SourceMapping(null, convertSourceFn(14))
  @Column({
    type: 'int',
    nullable: true,
  })
  progressBillingDefined: number;

  // Phải thu về cho vay ngắn hạn
  @SourceMapping(null, convertSourceFn(15))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermLoanReceivables: number;

  // Phải thu ngắn hạn khác
  @SourceMapping(null, convertSourceFn(16))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherShortTermReceivables: number;

  // Dự phòng phải thu ngắn hạn khó đòi (*)
  @SourceMapping(null, convertSourceFn(17))
  @Column({
    type: 'int',
    nullable: true,
  })
  provisionForShortTermDoubtfulDebts: number;

  // Tài sản thiếu chờ xử lý
  @SourceMapping(null, convertSourceFn(18))
  @Column({
    type: 'int',
    nullable: true,
  })
  assetsAwaitingResolution: number;

  // Hàng tồn kho Group
  @SourceMapping(null, convertSourceFn(19))
  @Column({
    type: 'int',
    nullable: true,
  })
  inventoriesGroup: number;

  // Hàng tồn kho
  @SourceMapping(null, convertSourceFn(20))
  @Column({
    type: 'int',
    nullable: true,
  })
  inventories: number;

  // Dự phòng giảm giá hàng tồn kho (*)
  @SourceMapping(null, convertSourceFn(21))
  @Column({
    type: 'int',
    nullable: true,
  })
  provisionForDeclineInValueOfInventories: number;

  // Tài sản ngắn hạn khác Group
  @SourceMapping(null, convertSourceFn(22))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherShortTermAssetsGroup: number;

  // Chi phí trả trước ngắn hạn
  @SourceMapping(null, convertSourceFn(23))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermPrepayments: number;

  // Thuế GTGT được khấu trừ
  @SourceMapping(null, convertSourceFn(24))
  @Column({
    type: 'int',
    nullable: true,
  })
  valueAddedTaxToBeReclaimed: number;

  // Thuế và các khoản khác phải thu của nhà nước
  @SourceMapping(null, convertSourceFn(25))
  @Column({
    type: 'int',
    nullable: true,
  })
  taxesAndOtherReceivables: number;

  // Giao dịch mua bán lại trái phiếu chính phủ
  @SourceMapping(null, convertSourceFn(26))
  @Column({
    type: 'int',
    nullable: true,
  })
  governmentBonds: number;

  // Tài sản ngắn hạn khác
  @SourceMapping(null, convertSourceFn(27))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherShortTermAssets: number;

  // TÀI SẢN DÀI HẠN
  @SourceMapping(null, convertSourceFn(28))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermAssets: number;

  // Các khoản phải thu dài hạn
  @SourceMapping(null, convertSourceFn(29))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermReceivables: number;

  // Các khoản phải thu dài hạn
  @SourceMapping(null, convertSourceFn(30))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermTradeReceivables: number;

  // Trả trước cho người bán dài hạn
  @SourceMapping(null, convertSourceFn(31))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermPrepaymentsToSuppliers: number;

  // Vốn kinh doanh ở các đơn vị trực thuộc
  @SourceMapping(null, convertSourceFn(32))
  @Column({
    type: 'int',
    nullable: true,
  })
  capitalAtInterCompany: number;

  // Phải thu nội bộ dài hạn
  @SourceMapping(null, convertSourceFn(33))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermInterCompanyReceivables: number;

  // Phải thu về cho vay dài hạn
  @SourceMapping(null, convertSourceFn(34))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermLoanReceivables: number;

  // Phải thu dài hạn khác
  @SourceMapping(null, convertSourceFn(35))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherLongTermReceivables: number;

  // Dự phòng phải thu dài hạn khó đòi (*)
  @SourceMapping(null, convertSourceFn(36))
  @Column({
    type: 'int',
    nullable: true,
  })
  provisionForLongTermDoubtfulDebts: number;

  // Tài sản cố định
  @SourceMapping(null, convertSourceFn(37))
  @Column({
    type: 'int',
    nullable: true,
  })
  fixedAssets: number;

  // Tài sản cố định hữu hình
  @SourceMapping(null, convertSourceFn(38))
  @Column({
    type: 'int',
    nullable: true,
  })
  tangibleFixedAssets: number;

  // Tài sản cố định hữu hình
  @SourceMapping(null, convertSourceFn(39))
  @Column({
    type: 'int',
    nullable: true,
  })
  costMaterial: number;

  // Giá trị hao mòn lũy kế (*)
  @SourceMapping(null, convertSourceFn(40))
  @Column({
    type: 'int',
    nullable: true,
  })
  accumulatedDepreciation: number;

  // Tài sản cố định thuê tài chính
  @SourceMapping(null, convertSourceFn(41))
  @Column({
    type: 'int',
    nullable: true,
  })
  financialLeasedFixedAssets: number;

  // Tài sản cố định thuê tài chính
  @SourceMapping(null, convertSourceFn(42))
  @Column({
    type: 'int',
    nullable: true,
  })
  costFinancialLeaseFixedAssets: number;

  // Giá trị hao mòn lũy kế của tài sản cố định thuê tài chính (*)
  @SourceMapping(null, convertSourceFn(43))
  @Column({
    type: 'int',
    nullable: true,
  })
  accumulatedDepreciationFinancialLease: number;

  // Tài sản cố định vô hình
  @SourceMapping(null, convertSourceFn(44))
  @Column({
    type: 'int',
    nullable: true,
  })
  intangibleFixedAssets: number;

  // Nguyên giá tài sản cố định vô hình
  @SourceMapping(null, convertSourceFn(45))
  @Column({
    type: 'int',
    nullable: true,
  })
  costIntangible: number;

  // Giá trị hao mòn lũy kế tài sản cố định vô hình
  @SourceMapping(null, convertSourceFn(46))
  @Column({
    type: 'int',
    nullable: true,
  })
  accumulatedDepreciationIntangible: number;

  // Bất động sản đầu tư
  @SourceMapping(null, convertSourceFn(47))
  @Column({
    type: 'int',
    nullable: true,
  })
  investmentProperties: number;

  // Nguyên giá Bất động sản đầu tư
  @SourceMapping(null, convertSourceFn(48))
  @Column({
    type: 'int',
    nullable: true,
  })
  costInvestmentProperties: number;

  // Giá trị hao mòn lũy kế bất động sản đầu tư
  @SourceMapping(null, convertSourceFn(49))
  @Column({
    type: 'int',
    nullable: true,
  })
  accumulatedDepreciationInvestmentProperties: number;

  // Tài sản dở dang dài hạn
  @SourceMapping(null, convertSourceFn(50))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermAssetsInProgress: number;

  // Chi phí sản xuất, kinh doanh dở dang dài hạn
  @SourceMapping(null, convertSourceFn(51))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermProductionInProgress: number;

  // Chi phí xây dựng cơ bản dở dang
  @SourceMapping(null, convertSourceFn(52))
  @Column({
    type: 'int',
    nullable: true,
  })
  constructionInProgress: number;

  // Đầu tư tài chính dài hạn
  @SourceMapping(null, convertSourceFn(53))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermFinancialInvestments: number;

  // Đầu tư vào công ty con
  @SourceMapping(null, convertSourceFn(54))
  @Column({
    type: 'int',
    nullable: true,
  })
  investmentsInSubsidiaries: number;

  // Đầu tư vào công ty liên kết. liên doanh
  @SourceMapping(null, convertSourceFn(55))
  @Column({
    type: 'int',
    nullable: true,
  })
  investmentsInAssociates: number;

  // Đầu tư vào công ty liên kết. liên doanh
  @SourceMapping(null, convertSourceFn(56))
  @Column({
    type: 'int',
    nullable: true,
  })
  investmentsInOtherEntities: number;

  // Dự phòng đầu tư tài chính dài hạn (*)
  @SourceMapping(null, convertSourceFn(57))
  @Column({
    type: 'int',
    nullable: true,
  })
  provisionForDiminution: number;

  // Đầu tư nắm giữ đến ngày đáo hạn
  @SourceMapping(null, convertSourceFn(58))
  @Column({
    type: 'int',
    nullable: true,
  })
  heldToMaturityFinancialInvestments: number;

  // Đầu tư dài hạn khác
  @SourceMapping(null, convertSourceFn(59))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherLongTermInvestments: number;

  // Tài sản dài hạn khác
  @SourceMapping(null, convertSourceFn(60))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherLongTermAssets: number;

  // Chi phí trả trước dài hạn
  @SourceMapping(null, convertSourceFn(61))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermPrepayments: number;

  // Tài sản thuế thu nhập hoãn lại
  @SourceMapping(null, convertSourceFn(62))
  @Column({
    type: 'int',
    nullable: true,
  })
  deferredIncomeTaxAssets: number;

  // Thiết bị, vật tư, phụ tùng thay thế dài hạn
  @SourceMapping(null, convertSourceFn(63))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermEquipmentSuppliesSpareParts: number;

  // Tài sản dài hạn khác của bất động sản
  @SourceMapping(null, convertSourceFn(64))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherLongTermAssetsRealEstate: number;

  // Lợi thế thương mại
  @SourceMapping(null, convertSourceFn(65))
  @Column({
    type: 'int',
    nullable: true,
  })
  goodwill: number;

  // Lợi thế thương mại
  @SourceMapping(null, convertSourceFn(66))
  @Column({
    type: 'int',
    nullable: true,
  })
  totalAssets: number;

  // NGUỒN VỐN
  @SourceMapping(null, convertSourceFn(67))
  @Column({
    type: 'int',
    nullable: true,
  })
  ownerEquityCapital: number;

  // NỢ PHẢI TRẢ
  @SourceMapping(null, convertSourceFn(68))
  @Column({
    type: 'int',
    nullable: true,
  })
  liabilities: number;

  // Nợ ngắn hạn
  @SourceMapping(null, convertSourceFn(69))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermLiabilities: number;

  // Phải trả người bán ngắn hạn
  @SourceMapping(null, convertSourceFn(70))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermTradeAccountsPayable: number;

  // Người mua trả tiền trước ngắn hạn
  @SourceMapping(null, convertSourceFn(71))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermAdvancesFromCustomers: number;

  // Thuế và các khoản phải nộp Nhà nước
  @SourceMapping(null, convertSourceFn(72))
  @Column({
    type: 'int',
    nullable: true,
  })
  taxesAndOtherPayables: number;

  // Phải trả người lao động
  @SourceMapping(null, convertSourceFn(73))
  @Column({
    type: 'int',
    nullable: true,
  })
  payableToEmployees: number;

  // Chi phí phải trả ngắn hạn
  @SourceMapping(null, convertSourceFn(74))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermAcrruedExpenses: number;

  // Phải trả nội bộ ngắn hạn
  @SourceMapping(null, convertSourceFn(75))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermInterCompanyPayables: number;

  // Phải trả theo tiến độ kế hoạch hợp đồng xây dựng
  @SourceMapping(null, convertSourceFn(76))
  @Column({
    type: 'int',
    nullable: true,
  })
  constructionContractProgressPayments: number;

  // Doanh thu chưa thực hiện ngắn hạn
  @SourceMapping(null, convertSourceFn(77))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermUnearnedRevenue: number;

  // Phải trả ngắn hạn khác
  @SourceMapping(null, convertSourceFn(78))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherShortTermPayables: number;

  // Vay và nợ thuê tài chính ngắn hạn
  @SourceMapping(null, convertSourceFn(79))
  @Column({
    type: 'int',
    nullable: true,
  })
  shortTermBorrowingsAndFinancialLeases: number;

  // Dự phòng phải trả ngắn hạn
  @SourceMapping(null, convertSourceFn(80))
  @Column({
    type: 'int',
    nullable: true,
  })
  provisionForShortTermLiabilities: number;

  // Quỹ khen thưởng, phúc lợi
  @SourceMapping(null, convertSourceFn(81))
  @Column({
    type: 'int',
    nullable: true,
  })
  bonusAndWelfareFund: number;

  // Quỹ bình ổn giá
  @SourceMapping(null, convertSourceFn(82))
  @Column({
    type: 'int',
    nullable: true,
  })
  priceStabilizationFund: number;

  // Giao dịch mua bán lại trái phiếu Chính phủ Nguồn vốn
  @SourceMapping(null, convertSourceFn(83))
  @Column({
    type: 'int',
    nullable: true,
  })
  governmentBondsCapital: number;

  // Nợ dài hạn
  @SourceMapping(null, convertSourceFn(84))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermLiabilities: number;

  // Phải trả người bán dài hạn
  @SourceMapping(null, convertSourceFn(85))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermTradePayables: number;

  // Người mua trả tiền trước dài hạn
  @SourceMapping(null, convertSourceFn(86))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermAdvancesFromCustomers: number;

  // Chi phí phải trả dài hạn
  @SourceMapping(null, convertSourceFn(87))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermAcrruedExpenses: number;

  // Phải trả nội bộ về vốn kinh doanh
  @SourceMapping(null, convertSourceFn(88))
  @Column({
    type: 'int',
    nullable: true,
  })
  interCompanyPayablesOnBusinessCapital: number;

  // Phải trả nội bộ dài hạn
  @SourceMapping(null, convertSourceFn(89))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermInterCompanyPayables: number;

  // Doanh thu chưa thực hiện dài hạn
  @SourceMapping(null, convertSourceFn(90))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermUnearnedRevenue: number;

  // Phải trả dài hạn khác
  @SourceMapping(null, convertSourceFn(91))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherLongTermLiabilities: number;

  // Vay và nợ thuê tài chính dài hạn
  @SourceMapping(null, convertSourceFn(92))
  @Column({
    type: 'int',
    nullable: true,
  })
  longTermBorrowingsAndFinancialLeases: number;

  // Trái phiếu chuyển đổi
  @SourceMapping(null, convertSourceFn(93))
  @Column({
    type: 'int',
    nullable: true,
  })
  convertibleBonds: number;

  // Cổ phiếu ưu đãi (Nợ)
  @SourceMapping(null, convertSourceFn(94))
  @Column({
    type: 'int',
    nullable: true,
  })
  preferredStockDebt: number;

  // Thuế thu nhập hoãn lại phải trả
  @SourceMapping(null, convertSourceFn(95))
  @Column({
    type: 'int',
    nullable: true,
  })
  deferredIncomeTaxLiabilities: number;

  // Dự phòng phải trả dài hạn
  @SourceMapping(null, convertSourceFn(96))
  @Column({
    type: 'int',
    nullable: true,
  })
  provisionForLongTermLiabilities: number;

  // Quỹ phát triển khoa học và công nghệ
  @SourceMapping(null, convertSourceFn(97))
  @Column({
    type: 'int',
    nullable: true,
  })
  fundForTechnologyDevelopment: number;

  // Dự phòng trợ cấp mất việc làm
  @SourceMapping(null, convertSourceFn(98))
  @Column({
    type: 'int',
    nullable: true,
  })
  provisionForSeveranceAllowances: number;

  // VỐN CHỦ SỞ HỮU Group
  @SourceMapping(null, convertSourceFn(99))
  @Column({
    type: 'int',
    nullable: true,
  })
  ownerEquityGroup: number;

  // VỐN CHỦ SỞ HỮU Group
  @SourceMapping(null, convertSourceFn(100))
  @Column({
    type: 'int',
    nullable: true,
  })
  ownerEquity: number;

  // Vốn góp của chủ sở hữu
  @SourceMapping(null, convertSourceFn(101))
  @Column({
    type: 'int',
    nullable: true,
  })
  ownerCapital: number;

  // Cổ phiếu phổ thông có quyền biểu quyết
  @SourceMapping(null, convertSourceFn(102))
  @Column({
    type: 'int',
    nullable: true,
  })
  commonStockWithVotingRight: number;

  // Cổ phiếu ưu đãi
  @SourceMapping(null, convertSourceFn(103))
  @Column({
    type: 'int',
    nullable: true,
  })
  preferredStock: number;

  // Thặng dư vốn cổ phần
  @SourceMapping(null, convertSourceFn(104))
  @Column({
    type: 'int',
    nullable: true,
  })
  sharePremium: number;

  // Quyền chọn chuyển đổi trái phiếu
  @SourceMapping(null, convertSourceFn(105))
  @Column({
    type: 'int',
    nullable: true,
  })
  convertibleBondOption: number;

  // Vốn khác của chủ sở hữu
  @SourceMapping(null, convertSourceFn(106))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherCapitalOfOwners: number;

  // Cổ phiếu quỹ (*)
  @SourceMapping(null, convertSourceFn(107))
  @Column({
    type: 'int',
    nullable: true,
  })
  treasuryShares: number;

  // Chênh lệch đánh giá lại tài sản
  @SourceMapping(null, convertSourceFn(108))
  @Column({
    type: 'int',
    nullable: true,
  })
  assetsRevaluationDifferences: number;

  // Chênh lệch tỷ giá hối đoái
  @SourceMapping(null, convertSourceFn(109))
  @Column({
    type: 'int',
    nullable: true,
  })
  foreignExchangeDifferences: number;

  // Quỹ đầu tư phát triển
  @SourceMapping(null, convertSourceFn(110))
  @Column({
    type: 'int',
    nullable: true,
  })
  investmentAndDevelopmentFund: number;

  // Quỹ hỗ trợ sắp xếp doanh nghiệp
  @SourceMapping(null, convertSourceFn(111))
  @Column({
    type: 'int',
    nullable: true,
  })
  fundToSupportCorporateRestructuring: number;

  // Quỹ khác thuộc vốn chủ sở hữu
  @SourceMapping(null, convertSourceFn(112))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherFundsFromOwnerEquity: number;

  // Lợi nhuận sau thuế chưa phân phối
  @SourceMapping(null, convertSourceFn(113))
  @Column({
    type: 'int',
    nullable: true,
  })
  undistributedEarningsAfterTax: number;

  // LNST chưa phân phối lũy kế đến cuối kỳ trước
  @SourceMapping(null, convertSourceFn(114))
  @Column({
    type: 'int',
    nullable: true,
  })
  accumulatedRetainedEarning: number;

  // LNST chưa phân phối kỳ này
  @SourceMapping(null, convertSourceFn(115))
  @Column({
    type: 'int',
    nullable: true,
  })
  undistributedEarningsInThisPeriod: number;

  // Nguồn vốn đầu tư XDCB
  @SourceMapping(null, convertSourceFn(116))
  @Column({
    type: 'int',
    nullable: true,
  })
  reservesForInvestmentInConstruction: number;

  // Lợi ích cổ đông không kiểm soát
  @SourceMapping(null, convertSourceFn(117))
  @Column({
    type: 'int',
    nullable: true,
  })
  minorityInterest: number;

  // Quỹ dự phòng tài chính
  @SourceMapping(null, convertSourceFn(118))
  @Column({
    type: 'int',
    nullable: true,
  })
  financialReserves: number;

  // Nguồn kinh phí và quỹ khác
  @SourceMapping(null, convertSourceFn(119))
  @Column({
    type: 'int',
    nullable: true,
  })
  otherResourcesAndFunds: number;

  // Nguồn kinh phí
  @SourceMapping(null, convertSourceFn(120))
  @Column({
    type: 'int',
    nullable: true,
  })
  subsidizedNotForProfitFunds: number;

  // Nguồn kinh phí đã hình thành TSCĐ
  @SourceMapping(null, convertSourceFn(121))
  @Column({
    type: 'int',
    nullable: true,
  })
  fundsInvestedInFixedAssets: number;

  // C. LỢI ÍCH CỔ ĐÔNG THIỂU SỐ
  @SourceMapping(null, convertSourceFn(122))
  @Column({
    type: 'int',
    nullable: true,
  })
  cMinorityInterest: number;

  // TỔNG CỘNG NGUỒN VỐN
  @SourceMapping(null, convertSourceFn(123))
  @Column({
    type: 'int',
    nullable: true,
  })
  totalOwnerEquityAndLiabilities: number;
}
