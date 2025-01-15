const axios = require('axios');
const { getCachedCurrencies } = require('./cacheModel');

// Modelo para obtener tasa de cambio entre dos monedas
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const { cryptocurrencies, fiatCurrencies } = getCachedCurrencies();

    // Verificar si las monedas son criptomonedas
    const isCryptoFrom = cryptocurrencies.find((crypto) => crypto.symbol === fromCurrency.toUpperCase());
    const isCryptoTo = cryptocurrencies.find((crypto) => crypto.symbol === toCurrency.toUpperCase());

    if (isCryptoFrom || isCryptoTo) {
      return await handleCryptoExchangeRate(fromCurrency, toCurrency);
    }

    // Si ambas son monedas tradicionales
    return await handleFiatExchangeRate(fromCurrency, toCurrency);
  } catch (error) {
    console.error(`Error al obtener el tipo de cambio entre ${fromCurrency} y ${toCurrency}:`, error.message);
    throw error;
  }
};

// Manejar conversión entre criptomonedas y monedas tradicionales
const handleCryptoExchangeRate = async (fromCurrency, toCurrency) => {
  const cryptoMap = {};
  const { cryptocurrencies } = getCachedCurrencies();

  // Crear un mapa de criptomonedas para obtener sus IDs
  cryptocurrencies.forEach((crypto) => {
    cryptoMap[crypto.symbol] = crypto.id;
  });

  const fromIsCrypto = cryptoMap[fromCurrency];
  const toIsCrypto = cryptoMap[toCurrency];

  if (fromIsCrypto && toIsCrypto) {
    // Ambas son criptomonedas: calcular conversión indirecta usando USD
    const fromRate = await getCryptoPriceInUSD(fromCurrency);
    const toRate = await getCryptoPriceInUSD(toCurrency);

    if (!fromRate || !toRate) {
      throw new Error(`No se encontraron tasas de cambio para ${fromCurrency} o ${toCurrency}.`);
    }

    return fromRate / toRate;
  }

  if (fromIsCrypto && !toIsCrypto) {
    // De criptomoneda a moneda tradicional
    return await getCryptoToFiatRate(fromCurrency, toCurrency);
  }

  if (!fromIsCrypto && toIsCrypto) {
    // De moneda tradicional a criptomoneda
    return await getFiatToCryptoRate(fromCurrency, toCurrency);
  }
};

// Manejar conversión entre monedas tradicionales
const handleFiatExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const { fiatCurrencies } = getCachedCurrencies();
    const fiatSymbols = fiatCurrencies.map((fiat) => fiat.symbol);

    if (!fiatSymbols.includes(fromCurrency) || !fiatSymbols.includes(toCurrency)) {
      throw new Error(`No se encontraron tasas de cambio para ${fromCurrency} o ${toCurrency}.`);
    }

    // Obtener tasa de cambio de una API
    const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
    const rate = response.data.rates[toCurrency];
    if (!rate) {
      throw new Error(`No se encontró un tipo de cambio para ${fromCurrency} a ${toCurrency}`);
    }
    return rate;
  } catch (error) {
    console.error('Error al manejar conversión de monedas tradicionales:', error.message);
    throw error;
  }
};

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

module.exports = { getExchangeRate };
