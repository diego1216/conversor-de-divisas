const express = require('express');
const { renderIndex, handleConversion } = require('../controllers/conversionController');
const { handleComparison } = require('../controllers/comparisonController');

const router = express.Router();

// Rutas
router.get('/', renderIndex);
router.post('/convert', handleConversion);
router.post('/compare', handleComparison);

module.exports = router;
