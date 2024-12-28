const axios = require('axios');

// Variables para almacenamiento en caché
let exchangeRatesCache = {};
let cryptoRatesCache = {};
let lastUpdatedTraditional = null;
let lastUpdatedCrypto = null;

// Intervalos de actualización (en milisegundos)
const UPDATE_INTERVAL_TRADITIONAL = 60 * 60 * 1000; // 1 hora
const UPDATE_INTERVAL_CRYPTO = 5 * 60 * 1000; // 5 minutos

// Función para actualizar tipos de cambio de monedas tradicionales
const updateExchangeRates = async () => {
  try {
    console.log('Actualizando tipos de cambio tradicionales...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    if (response.data && response.data.rates) {
      exchangeRatesCache = response.data.rates;
      lastUpdatedTraditional = new Date();
      console.log('Caché de monedas tradicionales actualizada:', exchangeRatesCache);
    } else {
      throw new Error('Datos de respuesta inválidos para monedas tradicionales.');
    }
  } catch (error) {
    console.error('Error al actualizar tipos de cambio tradicionales:', error.message);
  }
};

// Función para actualizar tipos de cambio de criptomonedas
const updateCryptoRates = async () => {
  try {
    console.log('Actualizando tipos de cambio de criptomonedas...');
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    if (response.data) {
      cryptoRatesCache = {
        BTC: response.data.bitcoin?.usd || null,
        ETH: response.data.ethereum?.usd || null,
      };
      lastUpdatedCrypto = new Date();
      console.log('Caché de criptomonedas actualizada:', cryptoRatesCache);
    } else {
      throw new Error('Datos de respuesta inválidos para criptomonedas.');
    }
  } catch (error) {
    console.error('Error al actualizar tipos de cambio de criptomonedas:', error.message);
  }
};

// Programar actualizaciones periódicas
setInterval(async () => {
  console.log('Iniciando actualización programada de tipos de cambio tradicionales...');
  await updateExchangeRates();
}, UPDATE_INTERVAL_TRADITIONAL);

setInterval(async () => {
  console.log('Iniciando actualización programada de tipos de cambio de criptomonedas...');
  await updateCryptoRates();
}, UPDATE_INTERVAL_CRYPTO);

// Función para obtener tipo de cambio desde la caché
const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  console.log(`Intentando convertir de ${fromCurrency} a ${toCurrency}...`);

  // Validar entrada
  if (!fromCurrency || !toCurrency) {
    throw new Error('Las monedas de origen y destino son obligatorias.');
  }

  const isCryptoFrom = cryptoRatesCache[fromCurrency];
  const isCryptoTo = cryptoRatesCache[toCurrency];

  if (isCryptoFrom || isCryptoTo) {
    // Manejo de criptomonedas
    const fromRate = cryptoRatesCache[fromCurrency] || (1 / exchangeRatesCache[fromCurrency]);
    const toRate = cryptoRatesCache[toCurrency] || (1 / exchangeRatesCache[toCurrency]);
    console.log('Tasas de cambio utilizadas (criptomonedas):', { fromRate, toRate });

    if (!fromRate || !toRate) {
      throw new Error(`La moneda ${fromCurrency} o ${toCurrency} no está disponible en la caché.`);
    }
    return fromRate / toRate; // CORREGIDO: Relación directa de tasas de cambio
  }

  // Manejo de monedas tradicionales
  if (!exchangeRatesCache[fromCurrency] || !exchangeRatesCache[toCurrency]) {
    throw new Error(`La moneda ${fromCurrency} o ${toCurrency} no está disponible en la caché.`);
  }
  console.log('Tasas de cambio utilizadas (monedas tradicionales):', {
    from: exchangeRatesCache[fromCurrency],
    to: exchangeRatesCache[toCurrency],
  });
  return exchangeRatesCache[fromCurrency] / exchangeRatesCache[toCurrency]; // CORREGIDO: Relación directa
};

// Inicializa la caché al inicio
(async () => {
  console.log('Inicializando la caché al inicio...');
  await updateExchangeRates();
  await updateCryptoRates();
})();

module.exports = {
  updateExchangeRates,
  updateCryptoRates,
  getCachedExchangeRate,
  exchangeRatesCache,
  cryptoRatesCache,
  lastUpdatedTraditional,
  lastUpdatedCrypto,
};
