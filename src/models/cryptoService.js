const axios = require('axios');

const getSupportedCryptos = async () => {
  try {
    console.log('Obteniendo la lista de criptomonedas...');
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');

    if (response.data && response.data.length > 0) {
      console.log('Criptomonedas obtenidas:', response.data.slice(0, 10)); // Muestra las primeras 10 para verificar
      return response.data.map((crypto) => ({
        id: crypto.id,
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
      }));
    } else {
      throw new Error('La respuesta de la API de CoinGecko es inválida o vacía.');
    }
  } catch (error) {
    console.error('Error al obtener criptomonedas:', error.message);
    return []; // Devuelve un array vacío en caso de error
  }
};

module.exports = { getSupportedCryptos };
