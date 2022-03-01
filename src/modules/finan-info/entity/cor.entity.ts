import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refId: number;

  @Column()
  catId: number;

  @Column({ unique: true })
  code: string;

  @Column()
  exchange: string;

  @Column()
  industryName1: string;

  @Column()
  industryName2: string;

  @Column()
  industryName3: string;

  @Column({
    type: 'bigint',
  })
  totalShares: number;

  @Column()
  name: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  firstTradeDate: Date;

  static convertToCorObject(vsData: any) {
    let firstTradeDate = null;
    const reTime = new RegExp('(/Date\\()(.*)(\\)/)');
    const _r: any = reTime.exec(vsData['FirstTradeDate']);
    if (_r.length === 4 && !isNaN(_r[2])) {
      firstTradeDate = new Date(parseInt(_r[2]));
    }
    return {
      refId: vsData['ID'],
      catId: vsData['CatID'],
      code: vsData['Code'],
      exchange: vsData['Exchange'],
      industryName1: vsData['IndustryName1'],
      industryName2: vsData['IndustryName2'],
      industryName3: vsData['IndustryName3'],
      name: vsData['Name'],
      totalShares: vsData['TotalShares'],
      firstTradeDate: firstTradeDate,
    };
  }
}
