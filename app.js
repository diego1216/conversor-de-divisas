const express = require('express');
const { getCachedCurrencies, getCachedExchangeRate } = require('./src/services/cacheService');
const router = express.Router();

// Página principal
router.get('/', (req, res) => {
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
});

// Conversión
router.post('/convert', (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;
  try {
    const rate = getCachedExchangeRate(fromCurrency, toCurrency);
    const result = (amount * rate).toFixed(2);
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas',
      cryptocurrencies,
      fiatCurrencies,
      result: `${amount} ${fromCurrency} = ${result} ${toCurrency}`,
    });
  } catch (error) {
    console.error('Error al convertir:', error.message);
    res.render('error', { message: error.message });
  }
});

module.exports = router;
