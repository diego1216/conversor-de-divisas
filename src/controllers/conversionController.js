// Importa las funciones necesarias desde el modelo de caché
const { getCachedCurrencies, getCachedExchangeRate } = require('../models/cacheModel');

// Controlador para renderizar la página principal
const renderHome = (req, res) => {
  try {
    // Obtiene las monedas (criptomonedas y monedas tradicionales) desde la caché
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    // Renderiza la vista 'index' con los datos necesarios
    res.render('index', {
      
      cryptocurrencies, // Lista de criptomonedas
      fiatCurrencies, // Lista de monedas tradicionales
    });
  } catch (error) {
    // Maneja errores y renderiza la vista de error con el mensaje correspondiente
    console.error('Error al cargar las opciones:', error.message);
    res.render('error', { message: 'No se pudieron cargar las opciones de conversión.' });
  }
};

// Controlador para realizar la conversión de monedas
const convertCurrency = (req, res) => {
  // Extrae los datos del formulario: cantidad, moneda de origen y moneda de destino
  const { amount, fromCurrency, toCurrency } = req.body;

  try {
    // Obtiene la tasa de cambio desde la caché
    const rate = getCachedExchangeRate(fromCurrency, toCurrency);

    // Calcula el resultado de la conversión
    const result = (amount * rate).toFixed(2);

    // Obtiene las monedas desde la caché
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    // Busca los detalles de la moneda de origen (puede ser criptomoneda o moneda tradicional)
    const fromDetails = cryptocurrencies.find((crypto) => crypto.symbol === fromCurrency) ||
                        fiatCurrencies.find((fiat) => fiat.symbol === fromCurrency);

    // Busca los detalles de la moneda de destino (puede ser criptomoneda o moneda tradicional)
    const toDetails = cryptocurrencies.find((crypto) => crypto.symbol === toCurrency) ||
                      fiatCurrencies.find((fiat) => fiat.symbol === toCurrency);

    // Renderiza la vista 'index' con los datos de la conversión
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas', // Título de la página
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas', // Subtítulo de la página
      cryptocurrencies, // Lista de criptomonedas
      fiatCurrencies, // Lista de monedas tradicionales
      result: `${amount} ${fromCurrency} = ${result} ${toCurrency}`, // Resultado de la conversión
      fromDetails, // Detalles de la moneda de origen
      toDetails, // Detalles de la moneda de destino
    });
  } catch (error) {
    // Maneja errores y renderiza la vista de error con el mensaje correspondiente
    console.error('Error al convertir:', error.message);
    res.render('error', { message: error.message });
  }
};

// Controlador para comparar dos monedas
const compareCurrencies = (req, res) => {
  // Extrae las monedas a comparar del formulario
  const { currencyA, currencyB } = req.body;

  try {
    // Obtiene las monedas desde la caché
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    // Busca los detalles de la primera moneda (puede ser criptomoneda o moneda tradicional)
    const currencyADetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyA) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyA);

    // Busca los detalles de la segunda moneda (puede ser criptomoneda o moneda tradicional)
    const currencyBDetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyB) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyB);

    // Renderiza la vista 'index' con los datos de comparación
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas', // Título de la página
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas', // Subtítulo de la página
      cryptocurrencies, // Lista de criptomonedas
      fiatCurrencies, // Lista de monedas tradicionales
      comparison: {
        currencyA: currencyADetails, // Detalles de la primera moneda
        currencyB: currencyBDetails, // Detalles de la segunda moneda
      },
    });
  } catch (error) {
    // Maneja errores y renderiza la vista de error con el mensaje correspondiente
    console.error('Error al comparar las divisas:', error.message);
    res.render('error', { message: 'Ocurrió un error al comparar las divisas.' });
  }
};

// Exporta los controladores para que puedan ser utilizados en otros archivos
module.exports = {
  renderHome, // Controlador para renderizar la página principal
  convertCurrency, // Controlador para realizar la conversión
  compareCurrencies, // Controlador para comparar monedas
};
