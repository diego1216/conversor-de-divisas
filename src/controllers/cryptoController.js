// Importa la función para obtener detalles de criptomonedas desde el modelo correspondiente
const { getCryptoDetails } = require('../models/cryptoModel');

// Controlador para renderizar los detalles de las criptomonedas
const renderCryptoDetails = async (req, res) => {
  try {
    // Llama al modelo para obtener los detalles de criptomonedas específicas (IDs de ejemplo: bitcoin, ethereum, ripple)
    const cryptos = await getCryptoDetails(['bitcoin', 'ethereum', 'ripple']);

    // Renderiza la vista 'cryptoDetails' y pasa los datos de las criptomonedas
    res.render('cryptoDetails', {
      title: 'Detalles de las Criptomonedas', // Título de la página
      cryptos, // Lista de criptomonedas con sus detalles
    });
  } catch (error) {
    // Maneja errores en caso de que falle la obtención de datos y renderiza la vista de error
    console.error('Error al renderizar los detalles de criptomonedas:', error.message);
    res.render('error', { message: 'No se pudieron cargar los detalles de criptomonedas.' });
  }
};

// Exporta la función del controlador para que pueda ser utilizada en otros archivos
module.exports = { renderCryptoDetails };
