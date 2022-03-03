import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Moment } from 'moment';
import { map } from 'rxjs';

@Injectable()
export class StockPriceRequest {
  constructor(private httpService: HttpService) {}

  getPrice(code: string, startDate?: Moment, endDate?: Moment) {
    return this.httpService
      .get(
        `https://www.bsc.com.vn/api/Data/Companies/HistoricalQuotes?symbol=${code}&startDate=2022-3-1&endDate=2022-3-3`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
            'sec-ch-ua':
              '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            cookie:
              'ASP.NET_SessionId=1azigeep1cbpw2u0n30sjeww; _culture=vi-VN; _ga=GA1.3.1493892654.1644206892; NSC_XfcTfswfs_443=ffffffff091da14845525d5f4f58455e445a4a42378b; __atuvc=1%7C9; __atuvs=62203cb235c4dace000; __atssc=google%3B1; _gid=GA1.3.423041939.1646279860; SL_G_WPT_TO=vi; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; _gat_UA-106411607-1=1',
            Referer: `https://www.bsc.com.vn/Companies/HistoricalQuotes/${code}`,
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
          method: 'GET',
        },
      )
      .pipe(
        map((res) => {
          if (Array.isArray(res?.data)) {
            return res.data;
          }

          return [];
        }),
      );
  }
}
