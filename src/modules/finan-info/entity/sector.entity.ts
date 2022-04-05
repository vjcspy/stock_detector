import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SectorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sectorName: string;

  @Column({
    type: 'smallint',
    nullable: false,
  })
  level: number;
}
