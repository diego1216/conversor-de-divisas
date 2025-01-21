const express = require('express'); // Importa el módulo de Express
const { getCachedCurrencies, getCachedExchangeRate } = require('../services/cacheService'); // Importa funciones del servicio de caché
const router = express.Router(); // Crea una nueva instancia de un enrutador de Express

// Página principal
router.get('/', (req, res) => {
  try {
    // Obtiene las criptomonedas y monedas fiduciarias almacenadas en la caché
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    // Renderiza la vista 'index' con los datos de las monedas
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas (los valores se actualizan cada 10 minutos)',
      cryptocurrencies,
      fiatCurrencies,
    });
  } catch (error) {
    // Manejo de errores en caso de problemas al cargar las opciones
    console.error('Error al cargar las opciones:', error.message);
    res.render('error', { message: 'No se pudieron cargar las opciones de conversión.' });
  }
});

// Ruta para la conversión de monedas
router.post('/convert', (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body; // Obtiene los datos del cuerpo de la solicitud
  try {
    // Calcula la tasa de cambio y el resultado
    const rate = getCachedExchangeRate(fromCurrency, toCurrency);
    const result = (amount * rate).toFixed(2);

    // Obtiene los detalles de las monedas de origen y destino
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();
    const fromDetails = cryptocurrencies.find((crypto) => crypto.symbol === fromCurrency) ||
                        fiatCurrencies.find((fiat) => fiat.symbol === fromCurrency);
    const toDetails = cryptocurrencies.find((crypto) => crypto.symbol === toCurrency) ||
                      fiatCurrencies.find((fiat) => fiat.symbol === toCurrency);

    // Renderiza la vista 'index' con el resultado de la conversión
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas (los valores se actualizan cada 10 minutos)',
      cryptocurrencies,
      fiatCurrencies,
      result: `${amount} ${fromCurrency} = ${result} ${toCurrency}`,
      fromDetails,
      toDetails,
    });
  } catch (error) {
    // Manejo de errores en caso de problemas durante la conversión
    console.error('Error al convertir:', error.message);
    res.render('error', { message: error.message });
  }
});

// Ruta para comparar divisas
router.post('/compare', (req, res) => {
  const { currencyA, currencyB } = req.body; // Obtiene las monedas a comparar del cuerpo de la solicitud

  try {
    // Obtiene las monedas almacenadas en la caché
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    // Busca los detalles de las monedas seleccionadas
    const currencyADetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyA) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyA);
    const currencyBDetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyB) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyB);

    // Renderiza la vista 'index' con los detalles de la comparación
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas',
      cryptocurrencies,
      fiatCurrencies,
      comparison: {
        currencyA: currencyADetails,
        currencyB: currencyBDetails,
      },
    });
  } catch (error) {
    // Manejo de errores en caso de problemas durante la comparación
    console.error('Error al comparar las divisas:', error.message);
    res.render('error', { message: 'Ocurrió un error al comparar las divisas.' });
  }
});

// Exporta el enrutador para que pueda ser utilizado en otros módulos
module.exports = router;
