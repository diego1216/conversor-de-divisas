const express = require('express'); // Importa el módulo de Express
const router = express.Router(); // Crea una nueva instancia de un enrutador de Express
const { handleComparison } = require('../controllers/comparisonController'); // Importa la función handleComparison desde el controlador correspondiente

// Define una ruta POST para manejar las comparaciones de divisas
router.post('/', handleComparison); // Llama a la función handleComparison cuando se recibe una solicitud POST en la raíz de este enrutador

// Exporta el enrutador para que pueda ser utilizado en otros módulos
module.exports = router;
