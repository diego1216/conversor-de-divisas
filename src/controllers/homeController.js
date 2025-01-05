const homePage = (req, res) => {
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas',
      subtitle: 'Convierte en tiempo real entre monedas tradicionales y criptomonedas.',
    });
  };
  
  module.exports = { homePage };
  