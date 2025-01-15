const axios = require('axios');

// Función para obtener las tasas de cambio de monedas fiduciarias
const getFiatExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (response.data && response.data.rates) {
      return response.data.rates;
    }
    throw new Error('La API devolvió datos vacíos o inválidos para monedas fiduciarias.');
  } catch (error) {
    console.error('Error al obtener tasas de cambio de monedas fiduciarias:', error.message);
    throw error;
  }
};

// Función para obtener el detalle de monedas fiduciarias específicas
const getFiatDetails = async (currencySymbols = []) => {
  try {
    const rates = await getFiatExchangeRates();
    const fiatDetails = currencySymbols.map((symbol) => ({
      symbol,
      rate: rates[symbol] || null,
    })).filter((detail) => detail.rate !== null);

    return fiatDetails;
  } catch (error) {
    console.error('Error al obtener detalles de monedas fiduciarias:', error.message);
    throw error;
  }
};

module.exports = { getFiatExchangeRates, getFiatDetails };
