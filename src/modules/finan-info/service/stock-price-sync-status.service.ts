import { Injectable } from '@nestjs/common';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stock-price-sync-status.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class StockPriceSyncStatusService {
  static get repo() {
    return this._repo ?? StockPriceSyncStatusEntity.getRepository();
  }
  private static _repo: Repository<StockPriceSyncStatusEntity>;

  public async getCurrentStatus(code: string) {
    const SyncStatusRepo = StockPriceSyncStatusService.repo;

    return await SyncStatusRepo.findOne({ where: { code } });
  }

  public async saveErrorStatus(code: string, error: Error) {
    let status: any = await this.getCurrentStatus(code);
    const SyncStatusRepo = StockPriceSyncStatusService.repo;

    if (!status) {
      status = {
        code,
        try: 0,
        lastUpdateDate: new Date(),
      };
    }

    status.try = !isNaN(status.try) ? status.try + 1 : 1;
    status.lastUpdateDate = new Date();
    status.lastError = error?.toString ? error.toString() : 'Unknown Error';

    return await SyncStatusRepo.save(status);
  }
}
