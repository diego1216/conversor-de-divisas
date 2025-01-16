const express = require('express'); // Importa el módulo de Express
const router = express.Router(); // Crea una nueva instancia de un enrutador de Express

const { handleConversion } = require('../controllers/conversionController'); // Importa la función handleConversion desde el controlador correspondiente

// Define una ruta POST para manejar las conversiones de divisas
router.post('/convert', handleConversion); // Llama a la función handleConversion cuando se recibe una solicitud POST en '/convert'

// Exporta el enrutador para que pueda ser utilizado en otros módulos
module.exports = router;
