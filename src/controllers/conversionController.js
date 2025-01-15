const { getCachedCurrencies, getCachedExchangeRate } = require('../models/cacheModel');

const renderIndex = (req, res) => {
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

const handleConversion = (req, res) => {
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

module.exports = {
  renderIndex,
  handleConversion,
};
