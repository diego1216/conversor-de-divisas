const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const cryptoMap = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      ADA: 'cardano',
      BNB: 'binancecoin',
      SOL: 'solana',
      XRP: 'ripple', 
      DOGE: 'dogecoin', 
      DOT: 'polkadot', 
      LTC: 'litecoin', 
      TRX: 'tron', 
      SHIB: 'shiba-inu',
      LINK: 'chainlink',
      XLM: 'stellar',
      XMR: 'monero',
      SAND: 'the-sandbox',
      ATOM: 'cosmos',
      ALGO: 'algorand',
      VET: 'vechain',
      XTZ: 'tezos',
      APE: 'apecoin',
      MANA: 'decentraland',
      AXS: 'axie-infinity',
      FIL: 'filecoin',
      ZEC: 'zcash',
      UNI: 'uniswap',
      LUNA: 'terra-luna',
      FTT: 'ftx-token',
      GRT: 'the-graph',
      FTM: 'fantom',
      KCS: 'kucoin-shares',
      HT: 'huobi-token',
      CHZ: 'chiliz',
      CRO: 'crypto-com-chain',
      OKB: 'okb',
      
    };

    if (cryptoMap[fromCurrency] || cryptoMap[toCurrency]) {
      // Si una de las monedas es criptomoneda
      const fromId = cryptoMap[fromCurrency] || fromCurrency.toLowerCase();
      const toId = cryptoMap[toCurrency] || toCurrency.toLowerCase();

      if (cryptoMap[fromCurrency] && !cryptoMap[toCurrency]) {
        // Convertir de criptomoneda a moneda fiduciaria
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${toCurrency.toLowerCase()}`;
        const response = await axios.get(url);
        const rate = response.data[fromId]?.[toCurrency.toLowerCase()];
        if (!rate) throw new Error(`No se encontró un tipo de cambio para ${fromCurrency} a ${toCurrency}`);
        return rate;
      } else if (!cryptoMap[fromCurrency] && cryptoMap[toCurrency]) {
        // Convertir de moneda fiduciaria a criptomoneda
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${toId}&vs_currencies=${fromCurrency.toLowerCase()}`;
        const response = await axios.get(url);
        const rate = 1 / response.data[toId]?.[fromCurrency.toLowerCase()];
        if (!rate) throw new Error(`No se encontró un tipo de cambio para ${fromCurrency} a ${toCurrency}`);
        return rate;
      } else {
        // Si ambas son criptomonedas
        throw new Error(`No se encontró un tipo de cambio directo entre criptomonedas: ${fromCurrency} y ${toCurrency}`);
      }
    } else {
      // Conversión entre monedas fiduciarias usando ExchangeRate API
      const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
      const response = await axios.get(url);
      const rate = response.data.rates[toCurrency];
      if (!rate) throw new Error(`No se encontró un tipo de cambio para ${fromCurrency} a ${toCurrency}`);
      return rate;
    }
  } catch (error) {
    console.error('Error al obtener el tipo de cambio:', error.message);
    throw error;
  }
};

module.exports = { getExchangeRate };
