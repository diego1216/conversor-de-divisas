const express = require('express');
const router = express.Router();

const { handleConversion } = require('../controllers/conversionController');

router.post('/convert', handleConversion);

module.exports = router;
