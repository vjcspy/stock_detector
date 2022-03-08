import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-indicator/financial-indicator.actions';
import { FinancialTermTypeEnum } from '@module/finan-info/store/financial-indicator/financial-indicator.reducer';
import { SyncFinancialIndicatorPublisher } from '@module/finan-info/queue/publisher/SyncFinancialIndicator.publisher';

@Controller('financial-indicator')
export class FinancialIndicatorController {
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
