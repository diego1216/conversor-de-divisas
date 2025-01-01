const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const {
  updateExchangeRates,
  updateCryptoRates,
  getExchangeRatesCache,
  getCryptoRatesCache,
} = require('./services/cacheService');

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

// Inicializa las cachés al inicio
(async () => {
  console.log('Inicializando cachés al inicio...');
  await updateExchangeRates();
  console.log('Caché de monedas tradicionales después de inicializar:', getExchangeRatesCache());

  await updateCryptoRates();
  console.log('Caché de criptomonedas después de inicializar:', getCryptoRatesCache());

  console.log('Cachés inicializadas.');
})();

// Ruta principal
app.get('/', (req, res) => {
  console.log('Procesando solicitud GET para la ruta principal...');

  const fiats = Object.entries(getExchangeRatesCache()).map(([symbol, rate]) => ({ symbol, rate }));
  const cryptos = Object.entries(getCryptoRatesCache()).map(([symbol, rate]) => ({ symbol, rate }));

  console.log('Fiats disponibles:', fiats);
  console.log('Criptomonedas disponibles:', cryptos);

  res.render('index', {
    title: 'Conversor de Divisas y Criptomonedas',
    subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
    cryptos,
    fiats,
    result: null,
    error: null,
  });
});

// Ruta para manejar la conversión
app.post('/convert', (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    console.log('Procesando conversión:', { amount, fromCurrency, toCurrency });

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Por favor, ingrese un monto válido.');
    }

    const exchangeRates = getExchangeRatesCache();
    const cryptoRates = getCryptoRatesCache();

    const fromRate = cryptoRates[fromCurrency] || exchangeRates[fromCurrency];
    const toRate = cryptoRates[toCurrency] || exchangeRates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error(
        `No se encontró la tasa de cambio para ${fromCurrency} o ${toCurrency}.`
      );
    }

    // Calcula la conversión
    const result = (amount * fromRate) / toRate;

    console.log('Resultado de la conversión:', result);

    const fiats = Object.entries(exchangeRates).map(([symbol, rate]) => ({ symbol, rate }));
    const cryptos = Object.entries(cryptoRates).map(([symbol, rate]) => ({ symbol, rate }));

    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
      cryptos,
      fiats,
      result: `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`,
      error: null,
    });
  } catch (error) {
    console.error('Error durante la conversión:', error.message);

    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
      cryptos: Object.entries(getCryptoRatesCache()).map(([symbol, rate]) => ({ symbol, rate })),
      fiats: Object.entries(getExchangeRatesCache()).map(([symbol, rate]) => ({ symbol, rate })),
      result: null,
      error: error.message,
    });
  }
});

module.exports = app;
