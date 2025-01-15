const axios = require('axios');
const { getCachedCurrencies } = require('../models/cacheModel');

// Obtener precio en USD para una criptomoneda
const getCryptoPriceInUSD = async (cryptoSymbol) => {
  const { cryptocurrencies } = getCachedCurrencies();
  const crypto = cryptocurrencies.find((c) => c.symbol === cryptoSymbol.toUpperCase());

  if (!crypto) {
    throw new Error(`No se encontró información para la criptomoneda ${cryptoSymbol}.`);
  }

  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.id}&vs_currencies=usd`
  );

  return response.data[crypto.id]?.usd || null;
};

// Obtener tasa de cambio de criptomoneda a moneda tradicional
const getCryptoToFiatRate = async (cryptoSymbol, fiatSymbol) => {
  const priceInUSD = await getCryptoPriceInUSD(cryptoSymbol);
  const response = await axios.get(`https://open.er-api.com/v6/latest/USD`);
  const fiatRate = response.data.rates[fiatSymbol];

  if (!fiatRate) {
    throw new Error(`No se encontró información para la moneda ${fiatSymbol}.`);
  }

  return priceInUSD * fiatRate;
};

// Obtener tasa de cambio de moneda tradicional a criptomoneda
const getFiatToCryptoRate = async (fiatSymbol, cryptoSymbol) => {
  const response = await axios.get(`https://open.er-api.com/v6/latest/${fiatSymbol}`);
  const rateToUSD = response.data.rates['USD'];
  const priceInUSD = await getCryptoPriceInUSD(cryptoSymbol);

  if (!rateToUSD || !priceInUSD) {
    throw new Error(`No se encontró información para la conversión de ${fiatSymbol} a ${cryptoSymbol}.`);
  }

  return rateToUSD / priceInUSD;
};

// Manejar conversión entre monedas tradicionales
const handleFiatExchangeRate = async (fromCurrency, toCurrency) => {
  const { fiatCurrencies } = getCachedCurrencies();
  const fiatSymbols = fiatCurrencies.map((fiat) => fiat.symbol);

  if (!fiatSymbols.includes(fromCurrency) || !fiatSymbols.includes(toCurrency)) {
    throw new Error(`No se encontraron tasas de cambio para ${fromCurrency} o ${toCurrency}.`);
  }

  const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
  const rate = response.data.rates[toCurrency];
  if (!rate) {
    throw new Error(`No se encontró un tipo de cambio para ${fromCurrency} a ${toCurrency}`);
  }
  return rate;
};

module.exports = {
  getCryptoPriceInUSD,
  getCryptoToFiatRate,
  getFiatToCryptoRate,
  handleFiatExchangeRate,
};
