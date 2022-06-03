

export const Volume = (exchange, days=30) =>
  `https://api.coingecko.com/api/v3/exchanges/${exchange}/volume_chart?days=${days}`;

export const DeribitVol = (currency) =>
  `http://18.193.105.218/volumes/${currency}`;

  export const ethPrice = (count) =>
  `https://test.deribit.com/api/v2/public/get_delivery_prices?count=1000&index_name=eth_usd&offset=${count}`;




