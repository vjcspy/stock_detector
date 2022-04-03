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
export class FinancialIndicatorsEntity extends BaseEntity {
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

  /*
   * --------------- Cơ cấu chi phí
   * */
  // Giá vốn hàng bán/doanh thu thuần
  @SourceMapping(null, convertSourceFn(57))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  costOfGoodSoldOverNetRevenue: number;

  // Chi phí bán hàng/Doanh thu thuần
  @SourceMapping(null, convertSourceFn(58))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  sellingExpensesOverNetRevenue: number;

  // Chi phí quản lý doanh nghiệp/Doanh thu thuần
  @SourceMapping(null, convertSourceFn(59))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  generalAndAdministrativeExpensesOverNetRevenue: number;

  // Chi phí lãi vay/doanh thu
  @SourceMapping(null, convertSourceFn(60))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  interestExpensesOverNetRevenue: number;

  /*
   * --------------- Cơ cấu tài sản dài hạn
   * */
  // Tài sản dài hạn/tổng tài sản
  @SourceMapping(null, convertSourceFn(67))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  longTermAssetsOverTotalAssets: number;
  // Tài sản cố định/tổng tài sản
  @SourceMapping(null, convertSourceFn(68))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  fixedAssetsOverTotalAssets: number;
  // Tài sản cố định hữu hình/Tài sản cố định
  @SourceMapping(null, convertSourceFn(69))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  tangibleFixedAssetsOverFixedAssets: number;
  // Tài sản thuê tài chính/Tài sản cố định
  @SourceMapping(null, convertSourceFn(70))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  financeLeaseOverFixedAssets: number;
  // Tài sản vô hình/Tài sản cố định
  @SourceMapping(null, convertSourceFn(71))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  intangibleFixedAssetsOverFixedAssets: number;
  // XDCBDD/Tài sản cố định
  @SourceMapping(null, convertSourceFn(72))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  constructionInProgressOverFixedAssets: number;
  /*
   * --------------- Cơ cấu tài sản ngắn hạn
   * */

  // Tài sản ngắn hạn/tổng tài sản
  @SourceMapping(null, convertSourceFn(61))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermAssetsOverTotalAssets: number;
  // Tiền/Tài sản ngắn hạn
  @SourceMapping(null, convertSourceFn(62))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashOverShortTermAssets: number;
  // Đầu tư tài chính ngắn hạn/Tài sản ngắn hạn
  @SourceMapping(null, convertSourceFn(63))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermInvestmentsOverShortTermAssets: number;
  // Phải thu ngắn hạn/Tài sản ngắn hạn
  @SourceMapping(null, convertSourceFn(64))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermReceivablesOverShortTermAssets: number;
  // Hàng tồn kho/Tài sản ngắn hạn
  @SourceMapping(null, convertSourceFn(65))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  inventoryOverShortTermAssets: number;
  // Tài sản ngắn hạn khác/Tài sản ngắn hạn
  @SourceMapping(null, convertSourceFn(66))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  otherShortTermAssetsOverShortTermAssets: number;

  /*
   * --------------- Nhóm chỉ số dòng tiền
   * */

  // Tỷ số dòng tiền HĐKD trên doanh thu thuần
  @SourceMapping(null, convertSourceFn(47))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  accrualRatioCF: number;

  // Khả năng chi trả nợ ngắn hạn từ dòng tiền HĐKD
  @SourceMapping(null, convertSourceFn(48))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashToIncome: number;

  // Khả năng chi trả nợ ngắn hạn từ lưu chuyển tiền thuần trong kỳ
  @SourceMapping(null, convertSourceFn(49))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  netCashFlowsOverShortTermLiabilities: number;

  // Tỷ lệ dồn tích (Phương pháp Cân đối kế toán)
  @SourceMapping(null, convertSourceFn(50))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  accrualRatioBalanceSheetMethod: number;

  // Tỷ lệ dồn tích (Phương pháp Dòng tiền)
  @SourceMapping(null, convertSourceFn(51))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  accrualRatioCashFlowMethod: number;

  // Dòng tiền từ HĐKD trên Tổng tài sản
  @SourceMapping(null, convertSourceFn(52))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashReturnToAssets: number;

  // Dòng tiền từ HĐKD trên Vốn chủ sở hữu
  @SourceMapping(null, convertSourceFn(53))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashReturnOnEquity: number;

  // Dòng tiền từ HĐKD trên Lợi nhuận thuần từ HĐKD
  @SourceMapping(null, convertSourceFn(54))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  operatingCashFlowOverRevenues: number;

  // Khả năng thanh toán nợ từ dòng tiền HĐKD
  @SourceMapping(null, convertSourceFn(55))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  debtCoverage: number;

  // Dòng tiền từ HĐKD trên mỗi cổ phần (CPS)
  @SourceMapping(null, convertSourceFn(56))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashFlowPerShareCPS: number;

  /*
   * --------------- Nhóm chỉ số hiệu quả hoạt động
   * */

  // Vòng quay phải thu khách hàng
  @SourceMapping(null, convertSourceFn(31))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  receivablesTurnover: number;

  // Thời gian thu tiền khách hàng bình quân
  @SourceMapping(null, convertSourceFn(32))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  daysOfSalesOutstanding: number;

  // Vòng quay hàng tồn kho
  @SourceMapping(null, convertSourceFn(33))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  inventoryTurnover: number;

  // Thời gian tồn kho bình quân
  @SourceMapping(null, convertSourceFn(34))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  daysOfInventoryOnHand: number;

  // Vòng quay phải trả nhà cung cấp
  @SourceMapping(null, convertSourceFn(35))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  payablesTurnover: number;

  // Thời gian trả tiền khách hàng bình quân
  @SourceMapping(null, convertSourceFn(36))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  numberOfDaysOfPayables: number;

  // Vòng quay tài sản cố định (Hiệu suất sử dụng tài sản cố định)
  @SourceMapping(null, convertSourceFn(37))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  fixedAssetTurnover: number;

  // Vòng quay tổng tài sản (Hiệu suất sử dụng toàn bộ tài sản)
  @SourceMapping(null, convertSourceFn(38))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  totalAssetTurnover: number;

  // Vòng quay vốn chủ sở hữu
  @SourceMapping(null, convertSourceFn(39))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  equityTurnover: number;

  /*
   * --------------- Nhóm chỉ số sinh lợi
   * */

  // Tỷ suất lợi nhuận gộp biên
  @SourceMapping(null, convertSourceFn(10))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  grossProfitMargin: number;

  // Tỷ lệ lãi EBIT
  @SourceMapping(null, convertSourceFn(11))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  ebitMargin: number;

  // Tỷ lệ lãi EBITDA
  @SourceMapping(null, convertSourceFn(12))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  ebitDAOverNetRevenue: number;

  // Tỷ suất sinh lợi trên doanh thu thuần
  @SourceMapping(null, convertSourceFn(13))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  netProfitMargin: number;

  // Tỷ suất lợi nhuận trên vốn chủ sở hữu bình quân (ROEA)
  @SourceMapping(null, convertSourceFn(14))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  roe: number;

  // Tỷ suất sinh lợi trên vốn dài hạn bình quân (ROCE)
  @SourceMapping(null, convertSourceFn(15))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  returnOnCapitalEmployedROCE: number;

  // Tỷ suất sinh lợi trên tổng tài sản bình quân (ROAA)
  @SourceMapping(null, convertSourceFn(16))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  roa: number;

  /*
   * --------------- Nhóm chỉ số thanh khoản
   * */

  // Tỷ số thanh toán bằng tiền mặt
  @SourceMapping(null, convertSourceFn(26))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashRatio: number;

  // Tỷ số thanh toán nhanh
  @SourceMapping(null, convertSourceFn(27))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  quickRatio: number;

  // Tỷ số thanh toán nhanh  (Đã loại trừ HTK, Phải thu ngắn hạn - Tham khảo)
  @SourceMapping(null, convertSourceFn(28))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  quickRatioShortTermReceivablesReference: number;

  // Tỷ số thanh toán hiện hành (ngắn hạn)
  @SourceMapping(null, convertSourceFn(29))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermRatio: number;

  // Khả năng thanh toán lãi vay
  @SourceMapping(null, convertSourceFn(30))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  interestCoverage: number;

  /*
   * --------------- Nhóm chỉ số tăng trưởng
   * */

  // Tăng trưởng  doanh thu thuần
  @SourceMapping(null, convertSourceFn(17))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  netRevenue: number;

  // Tăng trưởng  lợi nhuận gộp
  @SourceMapping(null, convertSourceFn(18))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  grossProfit: number;

  // Tăng trưởng lợi nhuận trước thuế
  @SourceMapping(null, convertSourceFn(19))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  profitBeforeTax: number;

  // Tăng trưởng lợi nhuận sau thuế của CĐ công ty mẹ
  @SourceMapping(null, convertSourceFn(20))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  profitAfterTaxForShareholdersOfTheParentCompany: number;

  // Tăng trưởng tổng tài sản
  @SourceMapping(null, convertSourceFn(21))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  totalAssets: number;

  // Tăng trưởng nợ dài hạn
  @SourceMapping(null, convertSourceFn(22))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  longTermLiabilities: number;

  // Tăng trưởng nợ phải trả
  @SourceMapping(null, convertSourceFn(23))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  liabilities: number;

  // Tăng trưởng vốn chủ sở hữu
  @SourceMapping(null, convertSourceFn(24))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  ownerEquity: number;

  // Tăng trưởng vốn điều lệ
  @SourceMapping(null, convertSourceFn(25))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  charterCapital: number;

  /*
   * --------------- Nhóm chỉ số đòn bẩy tài chính
   * */

  // Tỷ số Nợ ngắn hạn trên Tổng nợ phải trả
  @SourceMapping(null, convertSourceFn(40))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermLiabilitiesToTotalLiabilities: number;

  // Tỷ số Nợ vay trên Tổng tài sản
  @SourceMapping(null, convertSourceFn(41))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  debtToAssets: number;

  // Tỷ số Nợ trên Tổng tài sản
  @SourceMapping(null, convertSourceFn(42))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  liabilitiesToAssets: number;

  // Tỷ số Vốn chủ sở hữu trên Tổng tài sản
  @SourceMapping(null, convertSourceFn(43))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  equityToAssets: number;

  // Tỷ số Nợ ngắn hạn trên Vốn chủ sở hữu
  @SourceMapping(null, convertSourceFn(44))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermLiabilitiesToEquity: number;

  // Tỷ số Nợ vay trên Vốn chủ sở hữu
  @SourceMapping(null, convertSourceFn(45))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  debtToEquity: number;

  // Tỷ số Nợ trên Vốn chủ sở hữu
  @SourceMapping(null, convertSourceFn(46))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  liabilitiesToEquity: number;

  /*
   * --------------- Nhóm chỉ số định giá
   * */

  // Thu nhập trên mỗi cổ phần của 4 quý gần nhất (EPS)
  @SourceMapping(null, convertSourceFn(1))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  trailingEPS: number;

  // Giá trị sổ sách của cổ phiếu (BVPS)
  @SourceMapping(null, convertSourceFn(2))
  @Column('int', { unsigned: false, nullable: true })
  bookValuePerShareBVPS: number;

  // Chỉ số giá thị trường trên thu nhập (P/E)
  @SourceMapping(null, convertSourceFn(3))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  pe: number;

  // Chỉ số giá thị trường trên giá trị sổ sách (P/B)
  @SourceMapping(null, convertSourceFn(4))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  pb: number;

  // Chỉ số giá thị trường trên doanh thu thuần (P/S)
  @SourceMapping(null, convertSourceFn(5))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  ps: number;

  // Tỷ suất cổ tức
  @SourceMapping(null, convertSourceFn(6))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  dividendYield: number;

  // Beta
  @SourceMapping(null, convertSourceFn(7))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  beta: number;

  // Giá trị doanh nghiệp trên lợi nhuận trước thuế và lãi vay (EV/EBIT)
  @SourceMapping(null, convertSourceFn(8))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  evOverEBIT: number;

  // Giá trị doanh nghiệp trên lợi nhuận trước thuế, khấu hao và lãi vay (EV/EBITDA)
  @SourceMapping(null, convertSourceFn(9))
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  evOverEBITDA: number;
}
