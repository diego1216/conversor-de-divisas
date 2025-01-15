const { getCryptoDetails } = require('../models/cryptoModel');

const renderCryptoDetails = async (req, res) => {
  try {
    const cryptos = await getCryptoDetails(['bitcoin', 'ethereum', 'ripple']); // Ejemplo de IDs
    res.render('cryptoDetails', {
      title: 'Detalles de las Criptomonedas',
      cryptos,
    });
  } catch (error) {
    console.error('Error al renderizar los detalles de criptomonedas:', error.message);
    res.render('error', { message: 'No se pudieron cargar los detalles de criptomonedas.' });
  }
};

module.exports = { renderCryptoDetails };
