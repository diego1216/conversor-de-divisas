const axios = require('axios');

// Función para obtener las tasas de cambio de monedas fiduciarias
const getFiatExchangeRates = async (baseCurrency = 'USD') => {
  try {
    // Realiza una solicitud a la API para obtener las tasas de cambio basadas en la moneda base proporcionada
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    
    // Verifica si la respuesta contiene datos válidos de tasas de cambio
    if (response.data && response.data.rates) {
      return response.data.rates; // Devuelve las tasas de cambio
    }

    // Lanza un error si la respuesta no contiene datos válidos
    throw new Error('La API devolvió datos vacíos o inválidos para monedas fiduciarias.');
  } catch (error) {
    // Registra el error en la consola y lo lanza para que sea manejado por el llamador
    console.error('Error al obtener tasas de cambio de monedas fiduciarias:', error.message);
    throw error;
  }
};

// Función para obtener el detalle de monedas fiduciarias específicas
const getFiatDetails = async (currencySymbols = []) => {
  try {
    // Llama a la función para obtener todas las tasas de cambio
    const rates = await getFiatExchangeRates();
    
    // Filtra las monedas solicitadas y construye un objeto con sus detalles
    const fiatDetails = currencySymbols.map((symbol) => ({
      symbol, // Símbolo de la moneda
      rate: rates[symbol] || null, // Tasa de cambio o null si no está disponible
    })).filter((detail) => detail.rate !== null); // Filtra monedas con tasas válidas

    // Devuelve los detalles de las monedas fiduciarias solicitadas
    return fiatDetails;
  } catch (error) {
    // Registra el error en la consola y lo lanza para que sea manejado por el llamador
    console.error('Error al obtener detalles de monedas fiduciarias:', error.message);
    throw error;
  }
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos
module.exports = { getFiatExchangeRates, getFiatDetails };
