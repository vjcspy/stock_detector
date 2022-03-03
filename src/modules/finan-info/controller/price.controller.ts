import { Controller, Get, Header } from '@nestjs/common';
import { StockPriceRequest } from '@module/finan-info/requests/bsc/price.request';
import { Observable } from 'rxjs';

@Controller('stock-price')
export class PriceController {
  constructor(private priceRequest: StockPriceRequest) {}

  @Get('/test')
  @Header('Content-Type', 'application/json')
  test(): Observable<any[]> {
    return this.priceRequest.getPrice('BFC');
  }
}
