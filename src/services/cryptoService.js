const axios = require('axios');

// Obtener detalles de criptomonedas por IDs
const getCryptoDetails = async (ids) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: ids.join(','), // IDs de las criptomonedas
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles de criptomonedas:', error.message);
    throw error;
  }
};

module.exports = { getCryptoDetails };
