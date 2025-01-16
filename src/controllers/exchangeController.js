// Importa la función para obtener la tasa de cambio desde el modelo correspondiente
const { getExchangeRate } = require('../models/exchangeModel');

// Controlador para manejar la solicitud de obtención de tasas de cambio
const fetchExchangeRate = async (req, res) => {
  // Extrae las monedas de origen y destino de los parámetros de la consulta (query)
  const { fromCurrency, toCurrency } = req.query;

  // Verifica que los parámetros requeridos estén presentes
  if (!fromCurrency || !toCurrency) {
    return res
      .status(400) // Responde con un código de error 400 (Solicitud incorrecta)
      .json({ error: 'Faltan parámetros obligatorios: fromCurrency, toCurrency.' });
  }

  try {
    // Llama al modelo para obtener la tasa de cambio entre las monedas especificadas
    const rate = await getExchangeRate(fromCurrency, toCurrency);

    // Responde con un código 200 y envía la tasa de cambio como JSON
    res.status(200).json({ rate });
  } catch (error) {
    // Maneja errores en caso de que falle la obtención de la tasa de cambio
    console.error('Error al obtener tasa de cambio:', error.message);

    // Responde con un código 500 (Error interno del servidor) y envía un mensaje de error
    res.status(500).json({ error: 'No se pudo obtener la tasa de cambio.' });
  }
};

// Exporta la función del controlador para que pueda ser utilizada en otros archivos
module.exports = { fetchExchangeRate };
