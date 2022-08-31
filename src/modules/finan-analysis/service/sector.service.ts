import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(CorEntity)
    private corRepo: Repository<CorEntity>,
  ) {}

  async initTableSectorData() {
    // TODO: Cần phải tổ chức lại dữ liệu sector để có thể get được theo id
  }

  async getStocksBySector(name: any) {
    let id3: string;
    if (typeof name === 'string') {
      id3 = name;
    } else if (typeof name === 'object') {
      id3 = name['industryName3'];
    }
    return this.corRepo.find({
      where: {
        industryName3: id3,
      },
    });
  }

  async getSectors(): Promise<
    {
      count: number;
      industryName3: string;
    }[]
  > {
    return this.corRepo.query(
      `SELECT count(*) as count, industryName3 from cor_entity GROUP BY industryName3`,
    );
  }
}
