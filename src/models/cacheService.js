const axios = require('axios');

let exchangeRatesCache = {}; // Caché para monedas tradicionales
let cryptoRatesCache = {};   // Caché para criptomonedas

const updateExchangeRates = async () => {
  try {
    console.log('Actualizando tasas de cambio tradicionales...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    if (response.data && response.data.rates) {
      exchangeRatesCache = response.data.rates;
      console.log('Tasas de cambio tradicionales actualizadas:', exchangeRatesCache);
    } else {
      throw new Error('La respuesta de la API de tasas de cambio es inválida.');
    }
  } catch (error) {
    console.error('Error al actualizar tasas tradicionales:', error.message);
  }
};

const updateCryptoRates = async () => {
  try {
    console.log('Actualizando tasas de criptomonedas...');
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,cardano', // Lista de criptomonedas
        vs_currencies: 'usd',
      },
    });

    if (response.data) {
      cryptoRatesCache = Object.fromEntries(
        Object.entries(response.data).map(([key, value]) => [key.toUpperCase(), value.usd])
      );
      console.log('Tasas de criptomonedas actualizadas:', cryptoRatesCache);
    } else {
      throw new Error('La respuesta de la API de CoinGecko es inválida.');
    }
  } catch (error) {
    console.error('Error al actualizar tasas de criptomonedas:', error.message);
  }
};

// Inicializar la caché al inicio
(async () => {
  await updateExchangeRates();
  await updateCryptoRates();
})();

module.exports = { exchangeRatesCache, cryptoRatesCache, updateExchangeRates, updateCryptoRates };
