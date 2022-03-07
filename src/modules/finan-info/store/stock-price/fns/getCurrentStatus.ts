import { getRepository } from 'typeorm';
import { StockPriceSyncStatusEntity } from '@module/finan-info/entity/stock-price-sync-status.entity';

export const getCurrentStatus = async (code: string) => {
  const SyncStatusRepo = getRepository(StockPriceSyncStatusEntity);
  return await SyncStatusRepo.findOne({ where: { code } });
};
