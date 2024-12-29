const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { getCachedExchangeRate } = require('./services/cacheService');
const { getCryptoDetails, getFiatDetails } = require('./services/cryptoService');

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Conversor de Divisas',
    subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
    result: null,
    fromDetails: null,
    toDetails: null,
    error: null,
  });
});

// Ruta para manejar la conversión (POST)
app.post('/convert', async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  try {
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('El monto debe ser un número positivo mayor que 0.');
    }

    if (!fromCurrency || !toCurrency) {
      throw new Error('Seleccione monedas válidas para la conversión.');
    }

    const rate = getCachedExchangeRate(fromCurrency, toCurrency);
    if (!rate) {
      throw new Error(`No se pudo obtener el tipo de cambio entre ${fromCurrency} y ${toCurrency}.`);
    }

    const result = amount * rate;

    let fromDetails = null;
    let toDetails = null;

    const cryptoMap = { BTC: 'bitcoin', ETH: 'ethereum' };
    const cryptoIds = [];
    const fiatSymbols = [];

    if (cryptoMap[fromCurrency]) {
      cryptoIds.push(cryptoMap[fromCurrency]);
    } else {
      fiatSymbols.push(fromCurrency);
    }

    if (cryptoMap[toCurrency]) {
      cryptoIds.push(cryptoMap[toCurrency]);
    } else {
      fiatSymbols.push(toCurrency);
    }

    if (cryptoIds.length > 0) {
      const cryptoDetails = await getCryptoDetails(cryptoIds);
      fromDetails = cryptoDetails.find(crypto => crypto.symbol.toUpperCase() === fromCurrency) || fromDetails;
      toDetails = cryptoDetails.find(crypto => crypto.symbol.toUpperCase() === toCurrency) || toDetails;
    }

    if (fiatSymbols.length > 0) {
      const fiatDetails = await getFiatDetails(fiatSymbols);
      fromDetails = fiatDetails.find(fiat => fiat.symbol === fromCurrency) || fromDetails;
      toDetails = fiatDetails.find(fiat => fiat.symbol === toCurrency) || toDetails;
    }

    res.render('index', {
      title: 'Conversor de Divisas',
      subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
      result: `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`,
      fromDetails,
      toDetails,
      error: null,
    });
  } catch (error) {
    console.error('Error en la conversión:', error.message);
    res.render('index', {
      title: 'Conversor de Divisas',
      subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
      result: null,
      fromDetails: null,
      toDetails: null,
      error: `Error: ${error.message}`,
    });
  }
});

module.exports = app;
