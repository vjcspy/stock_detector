import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-info/financial-info.actions';
import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';
import { SyncFinancialInfoPublisher } from '@module/finan-info/queue/publisher/SyncFinancialInfo.publisher';
import { SyncFinancialInfoJob } from '@module/finan-info/job/sync-financial-info.job';

@Controller('fi')
export class FinancialInfoController {
  constructor(
    private stateManager: StateManager,
    private syncFiInfoPublisher: SyncFinancialInfoPublisher,
    private syncFinancialInfoJob: SyncFinancialInfoJob,
  ) {}

  @Get('/cstc')
  @Header('Content-Type', 'application/json')
  cstc() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'APG',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.INDICATOR,
        termType: FinancialTermTypeEnum.YEAR,
      }),
    );
    // this.syncFinancialInfoJob.indicatorYear();

    return [];
  }

  @Get('/cstcq')
  @Header('Content-Type', 'application/json')
  cstcq() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.INDICATOR,
        termType: FinancialTermTypeEnum.QUARTER,
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }

  @Get('/kqkd')
  @Header('Content-Type', 'application/json')
  kqkd() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.BUSINESS_REPORT,
        termType: FinancialTermTypeEnum.YEAR,
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }

  @Get('/kqkdq')
  @Header('Content-Type', 'application/json')
  kqkdq() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.BUSINESS_REPORT,
        termType: FinancialTermTypeEnum.QUARTER,
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }

  @Get('/cdkt')
  @Header('Content-Type', 'application/json')
  cdkt() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.BALANCE_SHEET,
        termType: FinancialTermTypeEnum.YEAR,
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }

  @Get('/cdktq')
  @Header('Content-Type', 'application/json')
  cdktq() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.BALANCE_SHEET,
        termType: FinancialTermTypeEnum.QUARTER,
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }

  @Get('/lctt')
  @Header('Content-Type', 'application/json')
  lctt() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.CASH_FLOW,
        termType: FinancialTermTypeEnum.YEAR,
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }

  @Get('/lcttq')
  @Header('Content-Type', 'application/json')
  lcttq() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.CASH_FLOW,
        termType: FinancialTermTypeEnum.QUARTER,
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }

  @Get('/publish-all')
  async publish() {
    await this.syncFinancialInfoJob.balanceSheetYear();
    await this.syncFinancialInfoJob.businessReportYear();
    await this.syncFinancialInfoJob.cashFlowYear();
    await this.syncFinancialInfoJob.indicatorYear();

    return 'ok';
  }
}
