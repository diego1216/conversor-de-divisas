const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { 
  getCachedExchangeRate, 
  exchangeRatesCache, 
  cryptoRatesCache, 
  lastUpdatedTraditional, 
  lastUpdatedCrypto 
} = require('./services/cacheService'); // Servicio de caché

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

// Ruta principal (GET)
app.get('/', (req, res) => {
  try {
    // Renderiza la página principal con tipos de cambio y fechas de actualización
    res.render('index', { 
      title: 'Conversor de Divisas', 
      subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
      exchangeRates: { ...exchangeRatesCache, ...cryptoRatesCache }, // Combina monedas y criptomonedas
      lastUpdatedTraditional: lastUpdatedTraditional?.toLocaleString() || 'N/A',
      lastUpdatedCrypto: lastUpdatedCrypto?.toLocaleString() || 'N/A', // Manejo seguro de fechas
    });
  } catch (error) {
    console.error('Error al cargar la página principal:', error.message);
    res.render('error', {
      message: 'Error al cargar los datos. Por favor, intente nuevamente.',
    });
  }
});

// Ruta para manejar la conversión (POST)
app.post('/convert', (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  try {
    // Validación de entrada
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('El monto debe ser un número positivo mayor que 0.');
    }
    if (!fromCurrency || !toCurrency) {
      throw new Error('Seleccione monedas válidas para la conversión.');
    }

    // Obtén el tipo de cambio
    const rate = getCachedExchangeRate(fromCurrency, toCurrency);
    const result = amount * rate;

    // Renderiza la página principal con el resultado
    res.render('index', {
      title: 'Conversor de Divisas',
      subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
      result: `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`,
      exchangeRates: { ...exchangeRatesCache, ...cryptoRatesCache },
      lastUpdatedTraditional: lastUpdatedTraditional?.toLocaleString() || 'N/A',
      lastUpdatedCrypto: lastUpdatedCrypto?.toLocaleString() || 'N/A',
    });
  } catch (error) {
    console.error('Error en la conversión:', error.message);
    res.render('index', {
      title: 'Conversor de Divisas',
      subtitle: 'Convierta entre monedas y criptomonedas en tiempo real',
      result: null,
      error: `Error: ${error.message}`,
      exchangeRates: { ...exchangeRatesCache, ...cryptoRatesCache },
      lastUpdatedTraditional: lastUpdatedTraditional?.toLocaleString() || 'N/A',
      lastUpdatedCrypto: lastUpdatedCrypto?.toLocaleString() || 'N/A',
    });
  }
});

module.exports = app;
