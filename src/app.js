require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Importar modelos para actualizar la caché
const { updateExchangeRates, updateCryptoRates } = require('./models/cacheService');

// Importar rutas
const currencyRoutes = require('./routes/currencyRoutes');

const app = express();

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Asegúrate de que las tasas están actualizadas antes de inicializar las rutas
(async () => {
  try {
    console.log('Actualizando tasas al iniciar el servidor...');
    await updateExchangeRates();
    await updateCryptoRates();
    console.log('Tasas actualizadas al iniciar el servidor.');

    // Rutas principales
    app.use('/', currencyRoutes);
  } catch (error) {
    console.error('Error al actualizar tasas al iniciar:', error.message);
  }
})();

module.exports = app;
