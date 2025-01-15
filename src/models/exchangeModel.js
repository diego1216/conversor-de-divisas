const {
    getCryptoPriceInUSD,
    getCryptoToFiatRate,
    getFiatToCryptoRate,
    handleFiatExchangeRate,
  } = require('../services/exchangeService');
  const { getCachedCurrencies } = require('./cacheModel');
  
  const getExchangeRate = async (fromCurrency, toCurrency) => {
    const { cryptocurrencies } = getCachedCurrencies();
  
    const isCryptoFrom = cryptocurrencies.find((crypto) => crypto.symbol === fromCurrency.toUpperCase());
    const isCryptoTo = cryptocurrencies.find((crypto) => crypto.symbol === toCurrency.toUpperCase());
  
    if (isCryptoFrom || isCryptoTo) {
      // Manejar conversiones relacionadas con criptomonedas
      return await handleCryptoExchangeRate(fromCurrency, toCurrency);
    }
  
    // Manejar conversiones entre monedas tradicionales
    return await handleFiatExchangeRate(fromCurrency, toCurrency);
  };
  
  const handleCryptoExchangeRate = async (fromCurrency, toCurrency) => {
    const { cryptocurrencies } = getCachedCurrencies();
    const cryptoMap = {};
  
    cryptocurrencies.forEach((crypto) => {
      cryptoMap[crypto.symbol] = crypto.id;
    });
  
    const fromIsCrypto = cryptoMap[fromCurrency];
    const toIsCrypto = cryptoMap[toCurrency];
  
    if (fromIsCrypto && toIsCrypto) {
      const fromRate = await getCryptoPriceInUSD(fromCurrency);
      const toRate = await getCryptoPriceInUSD(toCurrency);
      return fromRate / toRate;
    }
  
    if (fromIsCrypto) {
      return await getCryptoToFiatRate(fromCurrency, toCurrency);
    }
  
    return await getFiatToCryptoRate(fromCurrency, toCurrency);
  };
  
  module.exports = { getExchangeRate };
  