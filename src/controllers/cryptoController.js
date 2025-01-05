const { getCryptoDetails } = require('../models/cryptoService');

const cryptoDetails = async (req, res) => {
  try {
    const cryptos = await getCryptoDetails(['bitcoin', 'ethereum']);
    res.render('cryptoDetails', {
      title: 'Detalles de Criptomonedas',
      subtitle: 'Información sobre las principales criptomonedas.',
      cryptos,
    });
  } catch (error) {
    res.render('error', {
      message: 'No se pudieron obtener detalles de criptomonedas.',
    });
  }
};

module.exports = { cryptoDetails };
