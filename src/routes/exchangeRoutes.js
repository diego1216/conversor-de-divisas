const express = require('express');
const { fetchExchangeRate } = require('../controllers/exchangeController');

const router = express.Router();

router.get('/rate', fetchExchangeRate);

module.exports = router;
