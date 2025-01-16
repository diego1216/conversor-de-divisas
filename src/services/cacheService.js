const axios = require('axios'); // Importa el módulo axios para realizar solicitudes HTTP

// Variables para almacenar en caché las tasas de criptomonedas y monedas tradicionales
let cryptoRatesCache = {}; // Caché para criptomonedas
let exchangeRatesCache = {}; // Caché para monedas tradicionales

// Función para actualizar las tasas de cambio de criptomonedas
const updateCryptoRates = async () => {
  try {
    console.log('Iniciando actualización de criptomonedas...');
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', per_page: 50 }, // Configura los parámetros de la solicitud
    });

    // Procesa los datos y actualiza la caché de criptomonedas
    cryptoRatesCache = response.data.reduce((acc, coin) => {
      acc[coin.symbol.toUpperCase()] = {
        id: coin.id,
        name: coin.name,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
      };
      return acc;
    }, {});
    console.log('Actualización de criptomonedas completada.');
  } catch (error) {
    console.error('Error al actualizar criptomonedas:', error.message); // Manejo de errores
  }
};

// Función para actualizar las tasas de cambio de monedas tradicionales
const updateExchangeRates = async () => {
  try {
    console.log('Iniciando actualización de monedas tradicionales...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD'); // Solicita tasas basadas en USD
    exchangeRatesCache = response.data.rates; // Actualiza la caché con las tasas obtenidas
    console.log('Actualización de monedas tradicionales completada.');
  } catch (error) {
    console.error('Error al actualizar monedas tradicionales:', error.message); // Manejo de errores
  }
};

// Función para obtener las monedas almacenadas en la caché
const getCachedCurrencies = () => {
  // Convierte la caché de criptomonedas en un arreglo de objetos
  const cryptocurrencies = Object.keys(cryptoRatesCache).map((key) => ({
    symbol: key,
    ...cryptoRatesCache[key],
  }));

  // Convierte la caché de monedas tradicionales en un arreglo de objetos
  const fiatCurrencies = Object.keys(exchangeRatesCache).map((key) => ({
    symbol: key,
    name: key.toUpperCase(),
    rate: exchangeRatesCache[key],
  }));

  // Retorna ambas listas
  return { cryptocurrencies, fiatCurrencies };
};

// Función para obtener una tasa de cambio específica desde la caché
const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  const isCryptoFrom = cryptoRatesCache[fromCurrency]; // Verifica si la moneda origen es criptomoneda
  const isCryptoTo = cryptoRatesCache[toCurrency]; // Verifica si la moneda destino es criptomoneda

  if (isCryptoFrom || isCryptoTo) {
    // Calcula la tasa de cambio si alguna moneda es criptomoneda
    const fromRate = isCryptoFrom ? isCryptoFrom.current_price : 1 / exchangeRatesCache[fromCurrency];
    const toRate = isCryptoTo ? isCryptoTo.current_price : 1 / exchangeRatesCache[toCurrency];
    return fromRate / toRate;
  }

  // Verifica si ambas monedas son tradicionales
  if (!exchangeRatesCache[fromCurrency] || !exchangeRatesCache[toCurrency]) {
    throw new Error(`No se encontraron tasas para ${fromCurrency} o ${toCurrency}`);
  }

  // Calcula la tasa de cambio entre monedas tradicionales
  return exchangeRatesCache[toCurrency] / exchangeRatesCache[fromCurrency];
};

// Inicialización de la caché al iniciar el servidor
(async () => {
  await updateExchangeRates(); // Actualiza las tasas de monedas tradicionales
  await updateCryptoRates(); // Actualiza las tasas de criptomonedas
  setInterval(updateExchangeRates, 30 * 1000); // Configura una actualización periódica de monedas tradicionales
  setInterval(updateCryptoRates, 30 * 1000); // Configura una actualización periódica de criptomonedas
})();

// Exporta las funciones para usarlas en otros módulos
module.exports = {
  getCachedCurrencies,
  getCachedExchangeRate,
};
