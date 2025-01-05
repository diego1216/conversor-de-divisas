const express = require('express');
const { renderForm, convertCurrency } = require('../controllers/currencyController'); // Importación correcta
const router = express.Router();

// Ruta GET para renderizar el formulario principal
router.get('/', renderForm);

// Ruta POST para manejar la conversión de monedas
router.post('/', convertCurrency);

module.exports = router;
