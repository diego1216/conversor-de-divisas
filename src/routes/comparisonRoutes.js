const express = require('express');
const router = express.Router();
const { handleComparison } = require('../controllers/comparisonController'); // Asegúrate de que la ruta sea correcta

router.post('/', handleComparison);

module.exports = router;
