import { getRepository } from 'typeorm';
import { FinancialInfoStatusEntity } from '@module/finan-info/entity/financial-info-status.entity';

export const getFinanceInfoStatus = async (
  code: string,
  termType: number,
  type: number,
) => {
  const SyncStatusRepo = getRepository(FinancialInfoStatusEntity);
  return await SyncStatusRepo.findOne({ where: { code, termType, type } });
};
