const express = require('express');
const { cryptoDetails } = require('../controllers/cryptoController');
const router = express.Router();

router.get('/', cryptoDetails);

module.exports = router;
