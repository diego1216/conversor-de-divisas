const axios = require('axios');

// Caché para monedas tradicionales y criptomonedas
let exchangeRatesCache = {};
let cryptoRatesCache = {};
let fiatListCache = [];
let cryptoListCache = [];
let lastUpdatedTraditional = null;
let lastUpdatedCrypto = null;

// Intervalos de actualización (30 segundos)
const UPDATE_INTERVAL = 30 * 1000; // 30 segundos

// Actualizar monedas tradicionales
const updateFiatCurrencies = async () => {
  try {
    console.log('Actualizando lista de monedas tradicionales...');
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    if (response.data && response.data.rates) {
      // Limitar a 50 monedas
      fiatListCache = Object.keys(response.data.rates)
        .slice(0, 50)
        .map((symbol) => ({
          symbol,
          name: symbol, // Si hay nombres personalizados, puedes asignarlos aquí
        }));
      exchangeRatesCache = response.data.rates;
      lastUpdatedTraditional = new Date();
      console.log('Monedas tradicionales actualizadas en la caché.');
    }
  } catch (error) {
    console.error('Error al actualizar monedas tradicionales:', error.message);
  }
};

// Actualizar criptomonedas
const updateCryptoCurrencies = async () => {
  try {
    console.log('Actualizando lista de criptomonedas...');
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50, // Limitar a las 50 criptomonedas principales
          page: 1,
        },
      }
    );

    if (response.data) {
      // Generar lista de criptomonedas
      cryptoRatesCache = response.data.reduce((acc, coin) => {
        acc[coin.symbol.toUpperCase()] = coin.current_price;
        return acc;
      }, {});

      cryptoListCache = response.data.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
      }));

      lastUpdatedCrypto = new Date();
      console.log('Criptomonedas actualizadas en la caché.');
    }
  } catch (error) {
    console.error('Error al actualizar criptomonedas:', error.message);
  }
};

// Actualizar la caché al iniciar y programar actualizaciones automáticas
(async () => {
  console.log('Inicializando caché...');
  await updateFiatCurrencies();
  await updateCryptoCurrencies();
  setInterval(updateFiatCurrencies, UPDATE_INTERVAL);
  setInterval(updateCryptoCurrencies, UPDATE_INTERVAL);
})();

// Obtener monedas y criptomonedas desde la caché
const getCachedCurrencies = () => ({
  cryptocurrencies: cryptoListCache,
  fiatCurrencies: fiatListCache,
});

// Obtener tasa de cambio desde la caché
const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  const isCryptoFrom = cryptoRatesCache[fromCurrency.toUpperCase()];
  const isCryptoTo = cryptoRatesCache[toCurrency.toUpperCase()];

  if (isCryptoFrom || isCryptoTo) {
    const fromRate =
      cryptoRatesCache[fromCurrency.toUpperCase()] ||
      (1 / exchangeRatesCache[fromCurrency]);
    const toRate =
      cryptoRatesCache[toCurrency.toUpperCase()] ||
      (1 / exchangeRatesCache[toCurrency]);

    if (!fromRate || !toRate) {
      throw new Error(`No hay datos para convertir ${fromCurrency} a ${toCurrency}.`);
    }
    return fromRate / toRate;
  }

  if (!exchangeRatesCache[fromCurrency] || !exchangeRatesCache[toCurrency]) {
    throw new Error(`No hay datos disponibles para ${fromCurrency} o ${toCurrency}.`);
  }

  return exchangeRatesCache[toCurrency] / exchangeRatesCache[fromCurrency];
};

module.exports = {
  getCachedCurrencies,
  getCachedExchangeRate,
};
