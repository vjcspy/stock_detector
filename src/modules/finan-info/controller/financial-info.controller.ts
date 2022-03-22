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

  @Get('/test')
  @Header('Content-Type', 'application/json')
  test() {
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

  @Get('/publish')
  async publish() {
    this.syncFiInfoPublisher.publish();

    return 'ok';
  }
}
