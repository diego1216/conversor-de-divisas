const { getCachedCurrencies, getCachedExchangeRate } = require('../models/cacheModel');

const renderHome = (req, res) => {
  try {
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas',
      cryptocurrencies,
      fiatCurrencies,
    });
  } catch (error) {
    console.error('Error al cargar las opciones:', error.message);
    res.render('error', { message: 'No se pudieron cargar las opciones de conversión.' });
  }
};

const convertCurrency = (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;
  try {
    const rate = getCachedExchangeRate(fromCurrency, toCurrency);
    const result = (amount * rate).toFixed(2);
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    const fromDetails = cryptocurrencies.find((crypto) => crypto.symbol === fromCurrency) ||
                        fiatCurrencies.find((fiat) => fiat.symbol === fromCurrency);
    const toDetails = cryptocurrencies.find((crypto) => crypto.symbol === toCurrency) ||
                      fiatCurrencies.find((fiat) => fiat.symbol === toCurrency);

    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas',
      cryptocurrencies,
      fiatCurrencies,
      result: `${amount} ${fromCurrency} = ${result} ${toCurrency}`,
      fromDetails,
      toDetails,
    });
  } catch (error) {
    console.error('Error al convertir:', error.message);
    res.render('error', { message: error.message });
  }
};

const compareCurrencies = (req, res) => {
  const { currencyA, currencyB } = req.body;

  try {
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    const currencyADetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyA) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyA);

    const currencyBDetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyB) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyB);

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
    console.error('Error al comparar las divisas:', error.message);
    res.render('error', { message: 'Ocurrió un error al comparar las divisas.' });
  }
};

module.exports = {
  renderHome,
  convertCurrency,
  compareCurrencies,
};
