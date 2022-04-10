import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { syncOrderMatching } from '@module/finan-info/store/order-matching/order-matching.actions';
import { OrderMatchingType } from '@module/finan-info/schema/order-matching.schema';
import { OrderMatchingPublisher } from '@module/finan-info/queue/order-matching/order-matching.publisher';

@Controller('om')
export class OrderMatchingController {
  constructor(
    private stateManager: StateManager,
    private orderMatchingPublisher: OrderMatchingPublisher,
  ) {}

  @Get('/test')
  @Header('Content-Type', 'application/json')
  test() {
    this.stateManager.getStore().dispatch(
      syncOrderMatching.ACTION({
        code: 'HSG',
        type: OrderMatchingType.HISTORY,
        resolve: () => {
          console.log('resolve!');
        },
      }),
    );
    return [];
  }

  @Get('/publish')
  @Header('Content-Type', 'application/json')
  publish() {
    this.orderMatchingPublisher.publish();
  }
}
