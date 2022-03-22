import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { SyncFinancialIndicatorPublisher } from '@module/finan-info/queue/publisher/SyncFinancialIndicator.publisher';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-info/financial-info.actions';
import {
  FinancialInfoType,
  FinancialTermTypeEnum,
} from '@module/finan-info/entity/financial-info-status.entity';

@Controller('fi')
export class FinancialInfoController {
  constructor(
    private stateManager: StateManager,
    private syncFinancialIndicatorPublisher: SyncFinancialIndicatorPublisher,
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
        reject: () => {
          console.log('reject');
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
    this.syncFinancialIndicatorPublisher.publish();

    return 'ok';
  }
}
