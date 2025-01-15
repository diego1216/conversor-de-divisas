const cacheService = require('../services/cacheService');

const getCachedCurrencies = () => cacheService.getCachedCurrencies();

const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  try {
    return cacheService.getCachedExchangeRate(fromCurrency, toCurrency);
  } catch (error) {
    throw new Error(`Error al obtener la tasa de cambio: ${error.message}`);
  }
};

module.exports = {
  getCachedCurrencies,
  getCachedExchangeRate,
};
