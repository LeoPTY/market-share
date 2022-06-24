

export const Volume = (exchange, days=30) =>
  `https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/exchanges/${exchange}/volume_chart?days=${days}`;

export const DeribitVol = (currency) =>
  `https://cors-anywhere.herokuapp.com/http://18.193.105.218/volumes/${currency}`;

  export const ethPrice = (days) =>
  `https://cors-anywhere.herokuapp.com/https://deribit.com/api/v2/public/get_delivery_prices?count=${days}&index_name=eth_usd`;

  export const btcPrice = (days) =>
  `https://cors-anywhere.herokuapp.com/https://deribit.com/api/v2/public/get_delivery_prices?count=${days}&index_name=btc_usd`;




