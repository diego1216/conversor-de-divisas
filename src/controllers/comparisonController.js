const { getCachedCurrencies } = require('../models/cacheModel');

const handleComparison = (req, res) => {
  try {
    const { currencyA, currencyB } = req.body;
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    const currencyADetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyA) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyA);

    const currencyBDetails =
      cryptocurrencies.find((crypto) => crypto.symbol === currencyB) ||
      fiatCurrencies.find((fiat) => fiat.symbol === currencyB);

    res.render('index', {
      title: 'Comparación de Divisas y Criptomonedas',
      subtitle: 'Compara dos monedas diferentes',
      cryptocurrencies,
      fiatCurrencies,
      comparison: {
        currencyA: currencyADetails,
        currencyB: currencyBDetails,
      },
    });
  } catch (error) {
    console.error('Error al manejar la comparación:', error.message);
    res.render('error', { message: 'Ocurrió un error al comparar las divisas.' });
  }
};

module.exports = { handleComparison };
