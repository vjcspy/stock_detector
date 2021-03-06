import * as _ from 'lodash';
import { parseInt } from 'lodash';
import { getConnection } from 'typeorm';
import { FinancialIndicatorsEntity } from '@module/finan-info/entity/financial-indicators.entity';
import {
  FinancialInfoStatusEntity,
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';
import { FinancialCashFlowEntity } from '@module/finan-info/entity/financial-cash-flow.entity';
import { FinancialBalanceSheetEntity } from '@module/finan-info/entity/financial-balance-sheet.entity';
import { FinancialBusinessReportEntity } from '@module/finan-info/entity/financial-business-report.entity';

const getEntityBaseOnType = (type: FinancialInfoType) => {
  switch (type) {
    case FinancialInfoType.INDICATOR:
      return {
        entity: FinancialIndicatorsEntity,
      };

    case FinancialInfoType.CASH_FLOW:
      return {
        entity: FinancialCashFlowEntity,
      };

    case FinancialInfoType.BALANCE_SHEET:
      return {
        entity: FinancialBalanceSheetEntity,
      };

    case FinancialInfoType.BUSINESS_REPORT:
      return {
        entity: FinancialBusinessReportEntity,
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
    const financeInfos = parseFinanceInfoData(
      code,
      data[0],
      data[1],
      termType,
      type,
    );
    await queryRunner.manager.upsert(
      getEntityBaseOnType(type).entity,
      financeInfos,
      ['code', 'periodBegin', 'periodEnd'],
    );
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

    throw e;
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
  termType: FinancialTermTypeEnum,
  type: FinancialInfoType,
) => {
  const data: any[] = [];
  timeData.forEach((time: any, index: number) => {
    const sourceData: any[] = [];
    _.forEach(financeInfoData, (groupInfo: any) => {
      if (Array.isArray(groupInfo)) {
        _.forEach(groupInfo, (info: any) => {
          sourceData.push({ ...info, value: info[`Value${time.ID}`] });
        });
      }
    });

    const classEntity = getEntityBaseOnType(type).entity;

    const sourceDataConverted =
      // @ts-ignore
      new classEntity().convertSourceData(sourceData);

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
