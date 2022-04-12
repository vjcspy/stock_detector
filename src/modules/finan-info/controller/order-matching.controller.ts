import { Controller, Get, Header } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { syncOrderMatching } from '@module/finan-info/store/order-matching/order-matching.actions';
import {
  OrderMatching,
  OrderMatchingDocument,
  OrderMatchingType,
} from '@module/finan-info/schema/order-matching.schema';
import { OrderMatchingPublisher } from '@module/finan-info/queue/order-matching/order-matching.publisher';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('om')
export class OrderMatchingController {
  constructor(
    private stateManager: StateManager,
    private orderMatchingPublisher: OrderMatchingPublisher,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
    @InjectModel(OrderMatching.name)
    private orderMatchingModel: Model<OrderMatchingDocument>,
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

  @Get('/test-job')
  @Header('Content-Type', 'application/json')
  async testJob() {
    const cors = await this.corRepository.find();
    _.forEach(cors, async (cor) => {
      const docs = await this.orderMatchingModel.find({ code: cor.code });

      if (docs?.length > 2) {
        console.log(cor.code);
      }
    });

    return [];
  }
}
