import {
  VietStockCrds,
  VietStockCredentialsInterface,
} from '@module/finan-info/requests/vietstock/credentials';
import { retrieveCor } from '@module/finan-info/requests/vietstock/corporate';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { CorService } from '@module/finan-info/service/cor.service';

export const corGetPageFn = async (
  page: number,
  vsCreds?: VietStockCredentialsInterface,
) => {
  if (typeof vsCreds === 'undefined') {
    vsCreds = await VietStockCrds.retrieveCredentials();
  }
  try {
    const _data = await retrieveCor(page, vsCreds);
    const _aData = JSON.parse(_data);
    if (Array.isArray(_aData) && _aData.length > 0) {
      const values = [];
      for (let i = 0; i < _aData.length; i++) {
        values.push(CorEntity.convertToCorObject(_aData[i]));
      }
      const corRepo = CorService.corRepo;

      const _res = await corRepo.upsert(values, ['code']);

      return {
        affectedRows: _res?.raw?.affectedRows,
        numOfRecords: _aData.length,
      };
    }
    return {
      affectedRows: 0,
      numOfRecords: 0,
    };
  } catch (e) {
    console.log('error', e);

    return null;
  }
};
