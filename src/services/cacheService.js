const axios = require('axios');

// Cachés internas
let exchangeRatesCache = {};
let cryptoRatesCache = {};

const UPDATE_INTERVAL_TRADITIONAL = 60 * 60 * 1000; // 1 hora
const UPDATE_INTERVAL_CRYPTO = 5 * 60 * 1000; // 5 minutos

setInterval(async () => {
  console.log('Actualizando tipos de cambio tradicionales...');
  await updateExchangeRates();
}, UPDATE_INTERVAL_TRADITIONAL);

setInterval(async () => {
  console.log('Actualizando tipos de cambio de criptomonedas...');
  await updateCryptoRates();
}, UPDATE_INTERVAL_CRYPTO);

// Funciones de acceso a las cachés
const getExchangeRatesCache = () => exchangeRatesCache;
const getCryptoRatesCache = () => cryptoRatesCache;

const setExchangeRatesCache = (data) => {
  exchangeRatesCache = data;
};

const setCryptoRatesCache = (data) => {
  cryptoRatesCache = data;
};

// Función para actualizar monedas tradicionales
const updateExchangeRates = async () => {
  try {
    console.log('Inicio de actualización de monedas tradicionales...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    console.log('Respuesta de la API de monedas tradicionales:', response.data);

    if (response.data && response.data.rates) {
      setExchangeRatesCache(response.data.rates);
      console.log('Caché de monedas tradicionales actualizada:', getExchangeRatesCache());
    } else {
      console.warn('Datos de respuesta inválidos para monedas tradicionales.');
    }
  } catch (error) {
    console.error('Error al actualizar las monedas tradicionales:', error.message);
  }
};

// Función para actualizar criptomonedas
const updateCryptoRates = async () => {
  try {
    console.log('Inicio de actualización de criptomonedas...');
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,binancecoin,solana,ripple,dogecoin,polkadot,litecoin,tron,shiba-inu,chainlink,stellar,monero,the-sandbox,cosmos,algorand,vechain,tezos,apecoin,decentraland,axie-infinity,filecoin,zcash&vs_currencies=usd'
    );
    console.log('Respuesta de la API de criptomonedas:', response.data);

    if (response.data) {
      const cryptoRates = Object.entries(response.data).reduce((acc, [key, value]) => {
        acc[key.toUpperCase()] = value.usd || null;
        return acc;
      }, {});
      setCryptoRatesCache(cryptoRates);
      console.log('Caché de criptomonedas actualizada:', getCryptoRatesCache());
    } else {
      console.warn('Datos de respuesta inválidos para criptomonedas.');
    }
  } catch (error) {
    console.error('Error al actualizar las criptomonedas:', error.message);
  }
};

module.exports = {
  updateExchangeRates,
  updateCryptoRates,
  getExchangeRatesCache,
  getCryptoRatesCache,
};
