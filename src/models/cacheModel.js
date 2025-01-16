// Importa el servicio de caché que contiene la lógica para gestionar datos en caché
const cacheService = require('../services/cacheService');

// Función para obtener las monedas almacenadas en la caché
const getCachedCurrencies = () => cacheService.getCachedCurrencies();

// Función para obtener la tasa de cambio entre dos monedas desde la caché
const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  try {
    // Llama al servicio de caché para obtener la tasa de cambio
    return cacheService.getCachedExchangeRate(fromCurrency, toCurrency);
  } catch (error) {
    // Lanza un nuevo error con un mensaje más específico si algo falla
    throw new Error(`Error al obtener la tasa de cambio: ${error.message}`);
  }
};

// Exporta las funciones del modelo para que puedan ser utilizadas por otros módulos
module.exports = {
  getCachedCurrencies,
  getCachedExchangeRate,
};
