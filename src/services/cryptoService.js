const axios = require('axios'); // Importa el módulo axios para realizar solicitudes HTTP

// Función para obtener detalles de criptomonedas usando sus IDs
const getCryptoDetails = async (ids) => {
  try {
    // Realiza una solicitud a la API de CoinGecko para obtener detalles de las criptomonedas
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd', // Moneda de referencia (USD)
          ids: ids.join(','), // Convierte el arreglo de IDs en una cadena separada por comas
        },
      }
    );
    return response.data; // Retorna los datos obtenidos de la API
  } catch (error) {
    // Manejo de errores: muestra un mensaje en la consola y lanza el error
    console.error('Error al obtener detalles de criptomonedas:', error.message);
    throw error;
  }
};

// Exporta la función para que pueda ser utilizada en otros módulos
module.exports = { getCryptoDetails };
