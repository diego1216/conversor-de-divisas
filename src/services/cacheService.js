const axios = require('axios');

let cryptoRatesCache = {};
let exchangeRatesCache = {};

// Limpia la caché
const clearCache = () => {
  cryptoRatesCache = {};
  exchangeRatesCache = {};
  console.log('La caché ha sido limpiada.');
};

// Actualizar tasas de cambio de criptomonedas
const updateCryptoRates = async () => {
  try {
    console.log('Iniciando actualización de criptomonedas...');
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', per_page: 50 },
    });

    // Actualiza la caché de criptomonedas
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

    // Actualiza la caché de monedas tradicionales
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

// Limpieza y actualización automática de la caché cada 20 segundos
setInterval(async () => {
  clearCache();
  await updateExchangeRates();
  await updateCryptoRates();
}, 20 * 1000); // Cada 20 segundos

// Actualizar la caché al iniciar el servidor
(async () => {
  await updateExchangeRates();
  await updateCryptoRates();
})();

module.exports = {
  getCachedCurrencies,
  getCachedExchangeRate,
};
