import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { StockPriceEntity } from '@module/finan-info/entity/stockPrice.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const stockPriceEntity = new StockPriceEntity();
    // @ts-ignore
    return stockPriceEntity.convertSourceData({ 1: 1 });
  }
}
