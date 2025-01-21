// Importa la función para obtener las monedas almacenadas en caché desde el modelo de caché
const { getCachedCurrencies } = require('../models/cacheModel');

// Maneja la lógica para la comparación de dos monedas
const handleComparison = (req, res) => {
  try {
    // Extrae las monedas a comparar del cuerpo de la solicitud
    const { currencyA, currencyB } = req.body;

    // Obtiene las criptomonedas y monedas tradicionales desde la caché
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    // Busca los detalles de la primera moneda (puede ser criptomoneda o moneda tradicional)
    const currencyADetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyA) || // Si es criptomoneda
      fiatCurrencies.find((fiat) => fiat.symbol === currencyA); // Si es moneda tradicional

    // Busca los detalles de la segunda moneda (puede ser criptomoneda o moneda tradicional)
    const currencyBDetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyB) || // Si es criptomoneda
      fiatCurrencies.find((fiat) => fiat.symbol === currencyB); // Si es moneda tradicional

    // Renderiza la vista 'index' pasando los datos necesarios
    res.render('index', {
      
      cryptocurrencies, // Lista de criptomonedas para el formulario
      fiatCurrencies, // Lista de monedas tradicionales para el formulario
      comparison: {
        currencyA: currencyADetails, // Detalles de la primera moneda
        currencyB: currencyBDetails, // Detalles de la segunda moneda
      },
    });
  } catch (error) {
    // Maneja errores y renderiza la vista de error con el mensaje correspondiente
    console.error('Error al manejar la comparación:', error.message);
    res.render('error', { message: 'Ocurrió un error al comparar las divisas.' });
  }
};

// Exporta la función para su uso en otros archivos
module.exports = { handleComparison };
