const axios = require('axios'); // Importa el módulo axios para realizar solicitudes HTTP
const { getCachedCurrencies } = require('../models/cacheModel'); // Importa la función para obtener datos almacenados en caché

// Obtener precio en USD para una criptomoneda
const getCryptoPriceInUSD = async (cryptoSymbol) => {
  // Obtiene las criptomonedas almacenadas en caché
  const { cryptocurrencies } = getCachedCurrencies();
  // Busca la criptomoneda específica por su símbolo
  const crypto = cryptocurrencies.find((c) => c.symbol === cryptoSymbol.toUpperCase());

  // Lanza un error si no se encuentra la criptomoneda
  if (!crypto) {
    throw new Error(`No se encontró información para la criptomoneda ${cryptoSymbol}.`);
  }

  // Realiza una solicitud a la API para obtener el precio en USD
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.id}&vs_currencies=usd`
  );

  // Retorna el precio en USD o null si no se encuentra
  return response.data[crypto.id]?.usd || null;
};

// Obtener tasa de cambio de criptomoneda a moneda tradicional
const getCryptoToFiatRate = async (cryptoSymbol, fiatSymbol) => {
  // Obtiene el precio de la criptomoneda en USD
  const priceInUSD = await getCryptoPriceInUSD(cryptoSymbol);
  // Realiza una solicitud para obtener las tasas de cambio desde USD
  const response = await axios.get(`https://open.er-api.com/v6/latest/USD`);
  const fiatRate = response.data.rates[fiatSymbol]; // Obtiene la tasa de cambio para la moneda fiat

  // Lanza un error si no se encuentra la tasa de cambio para la moneda fiat
  if (!fiatRate) {
    throw new Error(`No se encontró información para la moneda ${fiatSymbol}.`);
  }

  // Calcula y retorna la tasa de cambio
  return priceInUSD * fiatRate;
};

// Obtener tasa de cambio de moneda tradicional a criptomoneda
const getFiatToCryptoRate = async (fiatSymbol, cryptoSymbol) => {
  // Realiza una solicitud para obtener las tasas de cambio desde la moneda fiat
  const response = await axios.get(`https://open.er-api.com/v6/latest/${fiatSymbol}`);
  const rateToUSD = response.data.rates['USD']; // Obtiene la tasa de cambio hacia USD
  // Obtiene el precio de la criptomoneda en USD
  const priceInUSD = await getCryptoPriceInUSD(cryptoSymbol);

  // Lanza un error si no se encuentra la información necesaria
  if (!rateToUSD || !priceInUSD) {
    throw new Error(`No se encontró información para la conversión de ${fiatSymbol} a ${cryptoSymbol}.`);
  }

  // Calcula y retorna la tasa de cambio
  return rateToUSD / priceInUSD;
};

// Manejar conversión entre monedas tradicionales
const handleFiatExchangeRate = async (fromCurrency, toCurrency) => {
  // Obtiene las monedas fiat almacenadas en caché
  const { fiatCurrencies } = getCachedCurrencies();
  const fiatSymbols = fiatCurrencies.map((fiat) => fiat.symbol); // Extrae los símbolos de las monedas fiat

  // Lanza un error si alguna de las monedas no está en la lista
  if (!fiatSymbols.includes(fromCurrency) || !fiatSymbols.includes(toCurrency)) {
    throw new Error(`No se encontraron tasas de cambio para ${fromCurrency} o ${toCurrency}.`);
  }

  // Realiza una solicitud para obtener las tasas de cambio desde la moneda origen
  const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
  const rate = response.data.rates[toCurrency]; // Obtiene la tasa de cambio hacia la moneda destino

  // Lanza un error si no se encuentra la tasa de cambio
  if (!rate) {
    throw new Error(`No se encontró un tipo de cambio para ${fromCurrency} a ${toCurrency}`);
  }

  // Retorna la tasa de cambio
  return rate;
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos
module.exports = {
  getCryptoPriceInUSD,
  getCryptoToFiatRate,
  getFiatToCryptoRate,
  handleFiatExchangeRate,
};
