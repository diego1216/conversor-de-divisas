const cacheService = require('../models/cacheService');

const renderForm = async (req, res) => {
  try {
    const currencies = Object.keys(cacheService.exchangeRatesCache || {});
    const cryptos = Object.keys(cacheService.cryptoRatesCache || {});

    console.log('Currencies:', currencies);
    console.log('Cryptos:', cryptos);

    if (currencies.length === 0 || cryptos.length === 0) {
      console.error('Las tasas no están disponibles. Intenta actualizar la caché.');
    }

    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte en tiempo real entre monedas tradicionales y criptomonedas.',
      currencies: currencies || [],
      cryptos: cryptos || [],
    });
  } catch (error) {
    console.error('Error al renderizar el formulario:', error.message);
    res.render('error', { message: 'No se pudieron cargar los datos.' });
  }
};

const convertCurrency = (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  try {
    const rate = cacheService.getCachedExchangeRate(fromCurrency, toCurrency);
    const result = (amount * rate).toFixed(2);

    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte en tiempo real entre monedas tradicionales y criptomonedas.',
      result: `${amount} ${fromCurrency} = ${result} ${toCurrency}`,
    });
  } catch (error) {
    console.error('Error al realizar la conversión:', error.message);
    res.render('error', { message: error.message });
  }
};

module.exports = { renderForm, convertCurrency };
