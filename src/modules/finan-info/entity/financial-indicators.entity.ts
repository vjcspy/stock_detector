import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SourceMapping } from '@module/core/decorator/entity/source-mapping/entity-with-source-mapping';

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

  /*
   * --------------- Cơ cấu chi phí
   * */
  // Giá vốn hàng bán/doanh thu thuần
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  costOfGoodSoldOverNetRevenue: number;

  // Chi phí bán hàng/Doanh thu thuần
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  sellingExpensesOverNetRevenue: number;

  // Chi phí quản lý doanh nghiệp/Doanh thu thuần
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  generalAndAdministrativeExpensesOverNetRevenue: number;

  // Chi phí lãi vay/doanh thu
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  interestExpensesOverNetRevenue: number;

  /*
   * --------------- Cơ cấu tài sản dài hạn
   * */
  // Tài sản dài hạn/tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  longTermAssetsOverTotalAssets: number;
  // Tài sản cố định/tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  fixedAssetsOverTotalAssets: number;
  // Tài sản cố định hữu hình/Tài sản cố định
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  tangibleFixedAssetsOverFixedAssets: number;
  // Tài sản thuê tài chính/Tài sản cố định
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  financeLeaseOverFixedAssets: number;
  // Tài sản vô hình/Tài sản cố định
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  intangibleFixedAssetsOverFixedAssets: number;
  // XDCBDD/Tài sản cố định
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  constructionInProgressOverFixedAssets: number;
  /*
   * --------------- Cơ cấu tài sản ngắn hạn
   * */

  // Tài sản ngắn hạn/tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermAssetsOverTotalAssets: number;
  // Tiền/Tài sản ngắn hạn
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashOverShortTermAssets: number;
  // Đầu tư tài chính ngắn hạn/Tài sản ngắn hạn
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermInvestmentsOverShortTermAssets: number;
  // Phải thu ngắn hạn/Tài sản ngắn hạn
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermReceivablesOverShortTermAssets: number;
  // Hàng tồn kho/Tài sản ngắn hạn
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  inventoryOverShortTermAssets: number;
  // Tài sản ngắn hạn khác/Tài sản ngắn hạn
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  otherShortTermAssetsOverShortTermAssets: number;

  /*
   * --------------- Nhóm chỉ số dòng tiền
   * */

  // Tỷ số dòng tiền HĐKD trên doanh thu thuần
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  accrualRatioCF: number;

  // Khả năng chi trả nợ ngắn hạn từ dòng tiền HĐKD
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashToIncome: number;

  // Khả năng chi trả nợ ngắn hạn từ lưu chuyển tiền thuần trong kỳ
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  netCashFlowsOverShortTermLiabilities: number;

  // Tỷ lệ dồn tích (Phương pháp Cân đối kế toán)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  accrualRatioBalanceSheetMethod: number;

  // Tỷ lệ dồn tích (Phương pháp Dòng tiền)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  accrualRatioCashFlowMethod: number;

  // Dòng tiền từ HĐKD trên Tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashReturnToAssets: number;

  // Dòng tiền từ HĐKD trên Vốn chủ sở hữu
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashReturnOnEquity: number;

  // Dòng tiền từ HĐKD trên Lợi nhuận thuần từ HĐKD
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  operatingCashFlowOverRevenues: number;

  // Khả năng thanh toán nợ từ dòng tiền HĐKD
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  debtCoverage: number;

  // Dòng tiền từ HĐKD trên mỗi cổ phần (CPS)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashFlowPerShareCPS: number;

  /*
   * --------------- Nhóm chỉ số hiệu quả hoạt động
   * */

  // Vòng quay phải thu khách hàng
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  receivablesTurnover: number;

  // Thời gian thu tiền khách hàng bình quân
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  daysOfSalesOutstanding: number;

  // Vòng quay hàng tồn kho
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  inventoryTurnover: number;

  // Thời gian tồn kho bình quân
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  daysOfInventoryOnHand: number;

  // Vòng quay phải trả nhà cung cấp
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  payablesTurnover: number;

  // Thời gian trả tiền khách hàng bình quân
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  numberOfDaysOfPayables: number;

  // Vòng quay tài sản cố định (Hiệu suất sử dụng tài sản cố định)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  fixedAssetTurnover: number;

  // Vòng quay tổng tài sản (Hiệu suất sử dụng toàn bộ tài sản)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  totalAssetTurnover: number;

  // Vòng quay vốn chủ sở hữu
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  equityTurnover: number;

  /*
   * --------------- Nhóm chỉ số sinh lợi
   * */

  // Tỷ suất lợi nhuận gộp biên
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  grossProfitMargin: number;

  // Tỷ lệ lãi EBIT
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  eBITMargin: number;

  // Tỷ lệ lãi EBITDA
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  eBITDAOverNetRevenue: number;

  // Tỷ suất sinh lợi trên doanh thu thuần
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  netProfitMargin: number;

  // Tỷ suất lợi nhuận trên vốn chủ sở hữu bình quân (ROEA)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  rOE: number;

  // Tỷ suất sinh lợi trên vốn dài hạn bình quân (ROCE)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  returnOnCapitalEmployedROCE: number;

  // Tỷ suất sinh lợi trên tổng tài sản bình quân (ROAA)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  rOA: number;

  /*
   * --------------- Nhóm chỉ số thanh khoản
   * */

  // Tỷ số thanh toán bằng tiền mặt
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  cashRatio: number;

  // Tỷ số thanh toán nhanh
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  quickRatio: number;

  // Tỷ số thanh toán nhanh  (Đã loại trừ HTK, Phải thu ngắn hạn - Tham khảo)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  quickRatioShortTermReceivablesReference: number;

  // Tỷ số thanh toán hiện hành (ngắn hạn)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermRatio: number;

  // Khả năng thanh toán lãi vay
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  interestCoverage: number;

  /*
   * --------------- Nhóm chỉ số tăng trưởng
   * */

  // Tăng trưởng  doanh thu thuần
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  netRevenue: number;

  // Tăng trưởng  lợi nhuận gộp
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  grossProfit: number;

  // Tăng trưởng lợi nhuận trước thuế
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  profitBeforeTax: number;

  // Tăng trưởng lợi nhuận sau thuế của CĐ công ty mẹ
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  profitAfterTaxForShareholdersOfTheParentCompany: number;

  // Tăng trưởng tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  totalAssets: number;

  // Tăng trưởng nợ dài hạn
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  longTermLiabilities: number;

  // Tăng trưởng nợ phải trả
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  liabilities: number;

  // Tăng trưởng vốn chủ sở hữu
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  ownerEquity: number;

  // Tăng trưởng vốn điều lệ
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  charterCapital: number;

  /*
   * --------------- Nhóm chỉ số đòn bẩy tài chính
   * */

  // Tỷ số Nợ ngắn hạn trên Tổng nợ phải trả
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermLiabilitiesToTotalLiabilities: number;

  // Tỷ số Nợ vay trên Tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  debtToAssets: number;

  // Tỷ số Nợ trên Tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  liabilitiesToAssets: number;

  // Tỷ số Vốn chủ sở hữu trên Tổng tài sản
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  equityToAssets: number;

  // Tỷ số Nợ ngắn hạn trên Vốn chủ sở hữu
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  shortTermLiabilitiesToEquity: number;

  // Tỷ số Nợ vay trên Vốn chủ sở hữu
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  debtToEquity: number;

  // Tỷ số Nợ trên Vốn chủ sở hữu
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  liabilitiesToEquity: number;

  /*
   * --------------- Nhóm chỉ số định giá
   * */

  // Thu nhập trên mỗi cổ phần của 4 quý gần nhất (EPS)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  trailingEPS: number;

  // Giá trị sổ sách của cổ phiếu (BVPS)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  bookValuePerShareBVPS: number;

  // Chỉ số giá thị trường trên thu nhập (P/E)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  pOverE: number;

  // Chỉ số giá thị trường trên giá trị sổ sách (P/B)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  pOverB: number;

  // Chỉ số giá thị trường trên doanh thu thuần (P/S)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  pOverS: number;

  // Tỷ suất cổ tức
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  dividendYield: number;

  // Beta
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  beta: number;

  // Giá trị doanh nghiệp trên lợi nhuận trước thuế và lãi vay (EV/EBIT)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  eVOverEBIT: number;

  // Giá trị doanh nghiệp trên lợi nhuận trước thuế, khấu hao và lãi vay (EV/EBITDA)
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  eVOverEBITDA: number;
}
