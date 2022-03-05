import { Controller, Get, Header } from '@nestjs/common';
import { StockPriceRequest } from '@module/finan-info/requests/bsc/price.request';
import { StateManager } from '@module/core/provider/state-manager';
import { stockPricesStartAction } from '@module/finan-info/store/stock-price/stock-price.actions';

@Controller('stock-price')
export class PriceController {
  constructor(
    private priceRequest: StockPriceRequest,
    private stateManager: StateManager,
  ) {}

  @Get('/test')
  @Header('Content-Type', 'application/json')
  test() {
    this.stateManager.getStore().dispatch(
      stockPricesStartAction({
        code: 'BFC',
      }),
    );
    // return this.priceRequest.getPrice('BFC');

    return [];
  }
}
