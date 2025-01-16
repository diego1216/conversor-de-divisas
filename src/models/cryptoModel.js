// Importa el servicio que contiene la lógica para obtener detalles de criptomonedas
const { getCryptoDetails } = require('../services/cryptoService');

// Función para obtener información de las criptomonedas por sus IDs
const fetchCryptoDetails = async (cryptoIds) => {
  try {
    // Llama al servicio para obtener los detalles de las criptomonedas con los IDs proporcionados
    return await getCryptoDetails(cryptoIds);
  } catch (error) {
    // Registra en la consola cualquier error que ocurra al obtener los detalles
    console.error('Error en el modelo al obtener detalles de criptomonedas:', error.message);
    // Lanza el error para que pueda ser manejado en niveles superiores
    throw error;
  }
};

// Exporta la función para que pueda ser utilizada en otros módulos
module.exports = { fetchCryptoDetails };
