const axios = require('axios');

// Servicio para obtener detalles de criptomonedas y monedas fiduciarias
const getCryptoDetails = async (cryptos = []) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: cryptos.join(','),
      },
    });

    if (response.data && response.data.length > 0) {
      return response.data;
    }

    console.error('La API devolvió datos vacíos o inválidos.');
    return [];
  } catch (error) {
    console.error('Error al obtener detalles de criptomonedas:', error.message);
    throw error;
  }
};

// Servicio para obtener detalles de monedas fiduciarias
const getFiatDetails = async (currencySymbols = []) => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    if (response.data && response.data.rates) {
      const rates = response.data.rates;
      const fiatDetails = currencySymbols.map(symbol => ({
        symbol,
        rate: rates[symbol],
      })).filter(detail => detail.rate !== undefined);

      return fiatDetails;
    }

    console.error('La API de tasas de cambio devolvió datos vacíos o inválidos.');
    return [];
  } catch (error) {
    console.error('Error al obtener detalles de monedas fiduciarias:', error.message);
    throw error;
  }
};

module.exports = { getCryptoDetails, getFiatDetails };
