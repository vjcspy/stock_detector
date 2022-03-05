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
    return stockPriceEntity.convertSourceData({
      Date: '2022-02-07T00:00:00Z',
      Symbol: 'BFC',
      PriceHigh: 28500.0,
      PriceLow: 27850.0,
      PriceOpen: 28000.0,
      PriceAverage: 28096.41,
      PriceClose: 28400.0,
      PricePreviousClose: 0.0,
      PriceBasic: 27050.0,
      TotalVolume: 0.0,
      DealVolume: 0.0,
      Volume: 167200.0,
      PutthroughVolume: 0.0,
      TotalTrade: 181.0,
      TotalValue: 4697719752.0,
      PutthroughValue: 0.0,
      BuyForeignQuantity: 55600.0,
      BuyForeignValue: 1561840000.0,
      SellForeignQuantity: 800.0,
      SellForeignValue: 22360000.0,
      BuyCount: 320.0,
      BuyQuantity: 626800.0,
      SellCount: 199.0,
      SellQuantity: 295400.0,
      BuyAvg: 1958.75,
      SellAvg: 1484.4221105527638,
      AdjRatio: 1.0,
      AdjClose: 28400.0,
      AdjOpen: 28000.0,
      AdjHigh: 28500.0,
      AdjLow: 27850.0,
      CurrentForeignRoom: 0.0,
      Shares: 0.0,
      Exchange: null,
      PE: null,
      PS: null,
      PB: null,
      MarketCap: 0.0,
      LastUpdated: null,
    });
  }
}
