const { getCryptoDetails } = require('../services/cryptoService');

// Obtener información de las criptomonedas por sus IDs
const fetchCryptoDetails = async (cryptoIds) => {
  try {
    return await getCryptoDetails(cryptoIds);
  } catch (error) {
    console.error('Error en el modelo al obtener detalles de criptomonedas:', error.message);
    throw error;
  }
};

module.exports = { fetchCryptoDetails };
