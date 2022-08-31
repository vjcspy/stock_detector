import { getRepository } from 'typeorm';
import {
  FinancialInfoStatusEntity,
  FinancialInfoType,
} from '@module/finan-info/entity/financial-info-status.entity';

export const getFinanceInfoStatus = async (
  code: string,
  termType: number,
  type: FinancialInfoType,
) => {
  const SyncStatusRepo = getRepository(FinancialInfoStatusEntity);
  return await SyncStatusRepo.findOne({ where: { code, termType, type } });
};
