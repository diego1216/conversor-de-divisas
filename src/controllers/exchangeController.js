const { getExchangeRate } = require('../models/exchangeModel');

const fetchExchangeRate = async (req, res) => {
  const { fromCurrency, toCurrency } = req.query;

  if (!fromCurrency || !toCurrency) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios: fromCurrency, toCurrency.' });
  }

  try {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    res.status(200).json({ rate });
  } catch (error) {
    console.error('Error al obtener tasa de cambio:', error.message);
    res.status(500).json({ error: 'No se pudo obtener la tasa de cambio.' });
  }
};

module.exports = { fetchExchangeRate };
