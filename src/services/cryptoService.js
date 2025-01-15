const axios = require('axios'); // Importa la librería axios para realizar solicitudes HTTP.

// Servicio para obtener detalles paginados de criptomonedas
const getPaginatedCryptos = async (page = 1, perPage = 30) => { // Define una función asíncrona que obtiene criptomonedas de manera paginada.
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', { // Realiza una solicitud GET a la API de CoinGecko para obtener datos de las criptomonedas.
      params: { // Parámetros de consulta que se envían junto con la solicitud.
        vs_currency: 'usd', // Define que las tasas de cambio se obtendrán en dólares estadounidenses.
        order: 'market_cap_desc', // Ordena las criptomonedas por capitalización de mercado en orden descendente.
        per_page: perPage, // Especifica el número máximo de criptomonedas por página (30 por defecto).
        page: page, // Indica la página que se está solicitando (1 por defecto).
      },
    });

    if (response.data) { // Verifica si la respuesta contiene datos.
      return response.data.map(crypto => ({ // Mapea los datos obtenidos para devolver solo la información relevante.
        id: crypto.id, // Incluye el identificador único de la criptomoneda.
        name: crypto.name, // Incluye el nombre de la criptomoneda.
        symbol: crypto.symbol.toUpperCase(), // Incluye el símbolo de la criptomoneda en mayúsculas.
      }));
    }

    throw new Error('La API devolvió datos vacíos.'); // Lanza un error si no se reciben datos en la respuesta.
  } catch (error) {
    console.error('Error al obtener criptomonedas paginadas:', error.message); // Muestra un mensaje de error en la consola si la solicitud falla.
    throw error; // Lanza el error para que el llamador maneje la excepción.
  }
};

<<<<<<< Updated upstream
module.exports = { getPaginatedCryptos }; // Exporta la función `getPaginatedCryptos` para que pueda ser utilizada en otros módulos.
=======
module.exports = { getCryptoDetails };
>>>>>>> Stashed changes
