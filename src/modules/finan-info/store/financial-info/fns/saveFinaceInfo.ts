import * as _ from 'lodash';
import { parseInt } from 'lodash';
import { getConnection } from 'typeorm';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import {
  FinancialInfoStatusEntity,
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';

const getEntityBaseOnType = (type: FinancialInfoType) => {
  switch (type) {
    case FinancialInfoType.INDICATOR:
      return {
        entity: FinancialIndicatorsEntity,
      };
  }
};

export const saveFinanceInfo = async (
  code: string,
  data: any,
  type: FinancialInfoType,
  termType: FinancialTermTypeEnum,
) => {
  let syncSuccess: any = 0;

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  try {
    // establish real database connection using our new query runner
    await queryRunner.connect();

    // lets now open a new transaction:
    await queryRunner.startTransaction();
    const financeInfos = parseFinanceInfoData(code, data[0], data[1], termType);
    await queryRunner.manager.upsert(FinancialIndicatorsEntity, financeInfos, [
      'code',
      'periodBegin',
      'periodEnd',
    ]);
    await queryRunner.manager.upsert(
      FinancialInfoStatusEntity,
      {
        code,
        type,
        termType: termType,
        year: _.last(financeInfos)['year'],
        quarter: _.last(financeInfos)['quarter'],
      },
      {
        conflictPaths: ['code', 'termType', 'type'],
      },
    );

    // commit transaction now:
    await queryRunner.commitTransaction();
    console.log(
      `sync success code: ${code} year: ${_.last(financeInfos)['year']}`,
    );
    syncSuccess = {
      success: true,
      lastYear: _.last(financeInfos)['year'],
      lastQuarter: _.last(financeInfos)['quarter'],
    };
  } catch (e) {
    syncSuccess = e;
    console.error(e);
    // since we have errors let's rollback changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }

  return syncSuccess;
};

const parseFinanceInfoData = (
  code: string,
  timeData: any[],
  financeInfoData: any[],
  termType: number,
) => {
  const data: any[] = [];
  timeData.forEach((time: any, index: number) => {
    const sourceData: any[] = [];
    _.forEach(financeInfoData, (groupInfo: any) => {
      if (Array.isArray(groupInfo)) {
        _.forEach(groupInfo, (info: any) => {
          sourceData.push({ ...info, value: info[`Value${index + 1}`] });
        });
      }
    });

    const sourceDataConverted =
      // @ts-ignore
      new FinancialIndicatorsEntity().convertSourceData(sourceData);

    const financeInfoObject = {
      code,
      quarter:
        time?.ReportTermID == 1 ? null : parseInt(time.TermCode.substr(1)),
      year: time.YearPeriod,
      termType,
      periodBegin: time.PeriodBegin,
      periodEnd: time.PeriodEnd,
      united: time.United,
      auditedStatus: time.AuditedStatus,
      ...sourceDataConverted,
    };

    data.push(financeInfoObject);
  });

  return data;
};
