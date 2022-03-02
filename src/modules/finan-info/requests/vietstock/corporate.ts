import fetch from 'node-fetch';

import { VietStockCredentialsInterface } from './credentials';

export const retrieveCor = async (
  page: any,
  vsCreds: VietStockCredentialsInterface,
) => {
  const { sid, rvt, vtsUsrLg, usrTk, csrf } = vsCreds;
  try {
    const r = await fetch('https://finance.vietstock.vn/data/corporateaz', {
      headers: {
        accept: '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        pragma: 'no-cache',
        'sec-ch-ua':
          '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        cookie: `ASP.NET_SessionId=${sid}; __RequestVerificationToken=${rvt}; language=vi-VN; Theme=Light; isShowLogin=true; vts_usr_lg=${vtsUsrLg}; vst_usr_lg_token=${usrTk}`,
        Referer:
          'https://finance.vietstock.vn/doanh-nghiep-a-z/danh-sach-niem-yet?page=1',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `catID=0&industryID=0&page=${page}&pageSize=50&type=1&code=&businessTypeID=0&orderBy=Code&orderDir=ASC&__RequestVerificationToken=${csrf}`,
      method: 'POST',
    });
    return await r.text();
  } catch (e) {
    return null;
  }
};
