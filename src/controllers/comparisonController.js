const { getCachedCurrencies } = require('../models/cacheModel');

const handleComparison = (req, res) => {
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
  handleComparison,
};
