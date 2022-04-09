import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { syncOrderMatching } from '@module/finan-info/store/order-matching/order-matching.actions';
import { OrderMatchingType } from '@module/finan-info/schema/order-matching.schema';

@Controller('om')
export class OrderMatchingController {
  constructor(private stateManager: StateManager) {}

  @Get('/test')
  @Header('Content-Type', 'application/json')
  test() {
    this.stateManager.getStore().dispatch(
      syncOrderMatching.ACTION({
        code: 'HSG',
        type: OrderMatchingType.INVESTOR,
      }),
    );
    return [];
  }
}
