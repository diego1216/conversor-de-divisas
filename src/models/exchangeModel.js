const {
  getCryptoPriceInUSD,
  getCryptoToFiatRate,
  getFiatToCryptoRate,
  handleFiatExchangeRate,
} = require('../services/exchangeService'); // Importa las funciones necesarias del servicio de exchange
const { getCachedCurrencies } = require('./cacheModel'); // Importa la función para obtener monedas en caché

// Función principal para obtener la tasa de cambio entre dos monedas
const getExchangeRate = async (fromCurrency, toCurrency) => {
  const { cryptocurrencies } = getCachedCurrencies(); // Obtiene las criptomonedas almacenadas en la caché

  // Verifica si alguna de las monedas es criptomoneda
  const isCryptoFrom = cryptocurrencies.find((crypto) => crypto.symbol === fromCurrency.toUpperCase());
  const isCryptoTo = cryptocurrencies.find((crypto) => crypto.symbol === toCurrency.toUpperCase());

  if (isCryptoFrom || isCryptoTo) {
    // Manejar conversiones relacionadas con criptomonedas
    return await handleCryptoExchangeRate(fromCurrency, toCurrency);
  }

  // Manejar conversiones entre monedas tradicionales
  return await handleFiatExchangeRate(fromCurrency, toCurrency);
};

// Función para manejar conversiones relacionadas con criptomonedas
const handleCryptoExchangeRate = async (fromCurrency, toCurrency) => {
  const { cryptocurrencies } = getCachedCurrencies(); // Obtiene las criptomonedas almacenadas en la caché
  const cryptoMap = {}; // Crea un mapa para vincular símbolos con sus IDs

  // Llena el mapa con los símbolos y IDs de las criptomonedas
  cryptocurrencies.forEach((crypto) => {
    cryptoMap[crypto.symbol] = crypto.id;
  });

  const fromIsCrypto = cryptoMap[fromCurrency]; // Verifica si la moneda de origen es criptomoneda
  const toIsCrypto = cryptoMap[toCurrency]; // Verifica si la moneda de destino es criptomoneda

  if (fromIsCrypto && toIsCrypto) {
    // Si ambas son criptomonedas, calcula la conversión indirecta usando USD
    const fromRate = await getCryptoPriceInUSD(fromCurrency); // Obtiene el precio en USD de la moneda de origen
    const toRate = await getCryptoPriceInUSD(toCurrency); // Obtiene el precio en USD de la moneda de destino
    return fromRate / toRate; // Devuelve la tasa de cambio entre las criptomonedas
  }

  if (fromIsCrypto) {
    // Si la moneda de origen es criptomoneda y la de destino no
    return await getCryptoToFiatRate(fromCurrency, toCurrency);
  }

  // Si la moneda de destino es criptomoneda y la de origen no
  return await getFiatToCryptoRate(fromCurrency, toCurrency);
};

// Exporta la función principal para ser utilizada en otros módulos
module.exports = { getExchangeRate };
