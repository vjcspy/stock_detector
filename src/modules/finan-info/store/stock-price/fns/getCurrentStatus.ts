import { getRepository } from 'typeorm';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stock-price-sync-status.entity';

export const getCurrentStatus = async (code: string) => {
  const SyncStatusRepo = getRepository(StockPriceSyncStatusEntity);
  return await SyncStatusRepo.findOne({ where: { code } });
};

export const saveErrorStatus = async (code: string, error: Error) => {
  let status = await getCurrentStatus(code);
  const SyncStatusRepo = getRepository(StockPriceSyncStatusEntity);

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
};
