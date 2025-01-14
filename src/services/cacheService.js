const axios = require('axios');

let cryptoRatesCache = {};
let exchangeRatesCache = {};


// Actualizar tasas de cambio de criptomonedas
const updateCryptoRates = async () => {

  try {
    console.log('Iniciando actualización de criptomonedas...');
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', per_page: 50 },
    });
    cryptoRatesCache = response.data.reduce((acc, coin) => {
      acc[coin.symbol.toUpperCase()] = {
        name: coin.name,

        current_price: coin.current_price,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
      };
      return acc;
    }, {});
    console.log('Actualización de criptomonedas completada.');

  } catch (error) {
    console.error('Error al actualizar criptomonedas:', error.message);
  }
};


// Actualizar tasas de cambio de monedas tradicionales
const updateExchangeRates = async () => {
  try {
    console.log('Iniciando actualización de monedas tradicionales...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    exchangeRatesCache = response.data.rates;
    console.log('Actualización de monedas tradicionales completada.');
  } catch (error) {
    console.error('Error al actualizar monedas tradicionales:', error.message);
  }
};

// Obtener tasas de cambio almacenadas
const getCachedCurrencies = () => {
  const cryptocurrencies = Object.keys(cryptoRatesCache).map((key) => ({
    symbol: key,
    ...cryptoRatesCache[key],
  }));

  const fiatCurrencies = Object.keys(exchangeRatesCache).map((key) => ({
    symbol: key,
    name: key.toUpperCase(),
    rate: exchangeRatesCache[key],
  }));


  return { cryptocurrencies, fiatCurrencies };
};

// Obtener tasa de cambio
const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  const isCryptoFrom = cryptoRatesCache[fromCurrency];
  const isCryptoTo = cryptoRatesCache[toCurrency];

  if (isCryptoFrom || isCryptoTo) {
    const fromRate = isCryptoFrom ? isCryptoFrom.current_price : 1 / exchangeRatesCache[fromCurrency];
    const toRate = isCryptoTo ? isCryptoTo.current_price : 1 / exchangeRatesCache[toCurrency];
    return fromRate / toRate;
  }

  if (!exchangeRatesCache[fromCurrency] || !exchangeRatesCache[toCurrency]) {
    throw new Error(`No se encontraron tasas para ${fromCurrency} o ${toCurrency}`);
  }

  return exchangeRatesCache[toCurrency] / exchangeRatesCache[fromCurrency];
};


// Actualizar la caché cada 30 segundos
setInterval(async () => {
  console.log('Actualizando caché de monedas tradicionales...');
  await updateExchangeRates();
}, 30 * 1000);

setInterval(async () => {
  console.log('Actualizando caché de criptomonedas...');
  await updateCryptoRates();
}, 30 * 1000);

// Actualizar la caché al iniciar el servidor
(async () => {
  await updateCryptoRates();
  await updateExchangeRates();
})();


module.exports = { getCachedCurrencies, getCachedExchangeRate, updateCryptoRates };
