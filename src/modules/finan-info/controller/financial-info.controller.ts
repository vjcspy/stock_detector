import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-info/financial-info.actions';
import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';
import { SyncFinancialInfoPublisher } from '@module/finan-info/queue/publisher/SyncFinancialInfo.publisher';

@Controller('fi')
export class FinancialInfoController {
  constructor(
    private stateManager: StateManager,
    private syncFiInfoPublisher: SyncFinancialInfoPublisher,
  ) {}

  @Get('/cstc')
  @Header('Content-Type', 'application/json')
  cstc() {
    this.stateManager.getStore().dispatch(
      startGetFinanceInfoAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
        type: FinancialInfoType.INDICATOR,
        termType: FinancialTermTypeEnum.YEAR,
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

  @Get('/publish')
  async publish() {
    this.syncFiInfoPublisher.publish();

    return 'ok';
  }
}
