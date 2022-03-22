import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { stockPricesStartAction } from '@module/finan-info/store/stock-price/stock-price.actions';
import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';

@Controller('sp')
export class PriceController {
  constructor(
    private stateManager: StateManager,
    private readonly syncStockPricePublisher: SyncStockPricePublisher,
  ) {}

  @Get('/test')
  @Header('Content-Type', 'application/json')
  test() {
    this.stateManager.getStore().dispatch(
      stockPricesStartAction({
        code: 'BFC',
        resolve: () => {
          console.log('resolve');
        },
      }),
    );

    return [];
  }

  @Get('/publish-cor')
  publishCor() {
    this.syncStockPricePublisher.publish();
    return {};
  }
}
