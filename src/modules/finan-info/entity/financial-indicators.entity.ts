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

  /*
   * --------------- Cơ cấu tài sản ngắn hạn
   * */

  /*
   * --------------- Nhóm chỉ số dòng tiền
   * */

  /*
   * --------------- Nhóm chỉ số hiệu quả hoạt động
   * */

  /*
   * --------------- Nhóm chỉ số sinh lợi
   * */

  /*
   * --------------- Nhóm chỉ số thanh khoản
   * */

  /*
   * --------------- Nhóm chỉ số tăng trưởng
   * */

  /*
   * --------------- Nhóm chỉ số đòn bẩy tài chính
   * */

  /*
   * --------------- Nhóm chỉ số định giá
   * */
}
