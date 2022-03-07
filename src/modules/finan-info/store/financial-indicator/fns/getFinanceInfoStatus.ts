import { getRepository } from 'typeorm';
import { FinancialIndicatorStatusEntity } from '@module/finan-info/entity/financial-indicatorStatus.entity';

export const getFinanceInfoStatus = async (code: string, termType: number) => {
  const SyncStatusRepo = getRepository(FinancialIndicatorStatusEntity);
  return await SyncStatusRepo.findOne({ where: { code, termType } });
};
