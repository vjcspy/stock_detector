import fetch from 'node-fetch';
import { VietStockCrds } from '@module/finan-info/requests/vietstock/credentials';

export const retrieveFinanceIBusinessReport = async (
  code: string,
  termType: number,
  page: number,
) => {
  const vsCreds = await VietStockCrds.retrieveCredentials();
  const { sid, rvt, vtsUsrLg, usrTk, csrf } = vsCreds;
  try {
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
        cookie: `ASP.NET_SessionId=${sid}; __RequestVerificationToken=${rvt}; language=vi-VN; Theme=Light; isShowLogin=true; vts_usr_lg=${vtsUsrLg}; vst_usr_lg_token=${usrTk}`,
        Referer: 'https://finance.vietstock.vn/BFC/tai-chinh.htm?tab=BCTT',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `Code=${code}&ReportType=KQKD&ReportTermType=${termType}&Unit=1000000000&Page=${page}&PageSize=4&__RequestVerificationToken=${csrf}`,
      method: 'POST',
    });

    const text = await res.text();
    return JSON.parse(text);
  } catch (e) {
    console.error('could not get finance info', e);
    return null;
  }
};
