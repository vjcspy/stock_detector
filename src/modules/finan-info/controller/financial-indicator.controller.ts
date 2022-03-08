import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { startGetFinanceInfoAction } from '@module/finan-info/store/financial-indicator/financial-indicator.actions';
import { FinancialTermTypeEnum } from '@module/finan-info/store/financial-indicator/financial-indicator.reducer';

@Controller('financial-indicator')
export class FinancialIndicatorController {
  constructor(private stateManager: StateManager) {}

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
}
