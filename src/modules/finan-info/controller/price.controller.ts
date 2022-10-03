import { Controller, Get, Header, Logger } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { stockPricesStartAction } from '@module/finan-info/store/stock-price/stock-price.actions';
import { SyncStockPricePublisher } from '@module/finan-info/queue/publisher/SyncStockPrice.publisher';

@Controller('sp')
export class PriceController {
  constructor(
    private stateManager: StateManager,
    private readonly syncStockPricePublisher: SyncStockPricePublisher,
    private readonly logger: Logger,
  ) {}

  @Get('/test')
  @Header('Content-Type', 'application/json')
  test() {
    const code = 'BFC';
    this.logger.log(`Test get price ${code}`);
    this.stateManager.getStore().dispatch(
      stockPricesStartAction({
        code,
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

  @Get('/vnindex')
  publishVNIndex() {
    this.syncStockPricePublisher.publishVnIndex();
    return {};
  }
}
