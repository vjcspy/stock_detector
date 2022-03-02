import fetch from 'node-fetch';

export const getPrice = async (code: string, year: number, page = 1) => {
  const res = await fetch(
    `https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:${code}~date:gte:${year}-01-01~date:lte:${year}-12-31&size=1000&page=${page}`,
    {
      headers: {
        accept: '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        'sec-ch-ua':
          '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        Referer: 'https://dstock.vndirect.com.vn/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: null,
      method: 'GET',
    },
  );

  const text = await res.text();
  const data = JSON.parse(text);
  if (Array.isArray(data?.data)) {
    if (data.data.length > 0) {
      const sortedData = data.data.sort(function (a, b) {
        return new Date(a['date']) > new Date(b['date']) ? 1 : -1;
      });
      return {
        ...data,
        data: sortedData,
      };
    }

    return {
      ...data,
    };
  } else {
    return null;
  }
};
