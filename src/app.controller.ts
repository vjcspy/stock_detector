import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { fetch } from '@module/core/util/fetch';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    const res = await fetch('https://finance.vietstock.vn/data/financeinfo', {
      headers: {
        accept: '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua':
          '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        cookie:
          'ASP.NET_SessionId=siqcnbpae2nfewz0gjjjz0hr; __RequestVerificationToken=UItKvY3nzAzJrCO7xiINajDEWfhgYECKK8ZZTCr-Qj7p9cKyE-72Bz4KU-BZu4SS9t7RJWr15TLeZDa6i1MHczV-etqlkdCCBaabGnKiWiI1; _ga=GA1.2.118933243.1639977161; _ga=GA1.3.118933243.1639977161; dable_uid=49026962.1612689358238; vts_usr_lg=F6901A0A1D84952F2A8B0825C96C5CEB8DC61C8FCF96A8C8F8B550043CAEBEB0154E7E85F46CF1B37CA23FC8810739603CEBC24C49DC0494D345D980DF7C4D807240F778D26014B760736DA3DF484B4C28EF23FD2012750E7D4AD83CD6F422F6AC78AAACE5E842DEB28CBECB97EEAC2FE25F502A0FF748BA3FA1A278EB173BFE; SL_G_WPT_TO=vi; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; isShowLogin=true; language=vi-VN; Theme=Light; _gid=GA1.2.986581068.1646624513; finance_viewedstock=BFC,; __gads=ID=f5dba87c678af42b:T=1639977160:S=ALNI_MZLHEhtufMXT1Wjo1pkiPZ2RnPB5Q',
        Referer: 'https://finance.vietstock.vn/BFC/tai-chinh.htm?tab=CSTC',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: 'Code=BFC&ReportType=CSTC&ReportTermType=1&Unit=1000000000&Page=2&PageSize=4&__RequestVerificationToken=xDCPawNqxeiYnYsx5bFkurVak8dfP8VbBu9EnyPQ8FdDbi_-OTfrfbiO5Ux5vhSPJrXG_CZq4oSGAdYi65iCtXihTh_qMMvt9jQMgntoO9moZCg5A91mJf747JS8Ua4A0',
      method: 'POST',
    });

    const a = await res.text();

    return a;
  }
}
