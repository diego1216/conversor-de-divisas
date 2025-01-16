const express = require('express'); // Importa el módulo de Express
const { fetchExchangeRate } = require('../controllers/exchangeController'); // Importa la función fetchExchangeRate desde el controlador correspondiente

const router = express.Router(); // Crea una nueva instancia de un enrutador de Express

// Define una ruta GET para obtener la tasa de cambio
router.get('/rate', fetchExchangeRate); // Llama a la función fetchExchangeRate cuando se recibe una solicitud GET en '/rate'

// Exporta el enrutador para que pueda ser utilizado en otros módulos
module.exports = router;
