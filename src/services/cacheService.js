const axios = require('axios');

// Variables para almacenamiento en caché
let exchangeRatesCache = {};
let cryptoRatesCache = {};
let lastUpdatedTraditional = null;
let lastUpdatedCrypto = null;

// Intervalos de actualización (en milisegundos)
const UPDATE_INTERVAL_TRADITIONAL = 60 * 60 * 1000; // 1 hora
const UPDATE_INTERVAL_CRYPTO = 5 * 60 * 1000; // 5 minutos

// Función para actualizar tipos de cambio de monedas tradicionales
const updateExchangeRates = async () => {
  try {
    console.log('Actualizando tipos de cambio tradicionales...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    if (response.data && response.data.rates) {
      exchangeRatesCache = response.data.rates;
      lastUpdatedTraditional = new Date();
      console.log('Caché de monedas tradicionales actualizada:', exchangeRatesCache);
    } else {
      throw new Error('Datos de respuesta inválidos para monedas tradicionales.');
    }
  } catch (error) {
    console.error('Error al actualizar tipos de cambio tradicionales:', error.message);
  }
};

// Función para actualizar tipos de cambio de criptomonedas
const updateCryptoRates = async () => {
  try {
    console.log('Actualizando tipos de cambio de criptomonedas...');
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,binancecoin,solana,ripple,dogecoin,polkadot,litecoin,tron,shiba-inu,chainlink,stellar,monero,the-sandbox,cosmos,algorand,vechain,tezos,apecoin,decentraland,axie-infinity,filecoin,zcash,uniswap,avalanche,terra-luna,ftx-token,theta-network,hedera,elrond,near-protocol,the-graph,fantom,kucoin-shares,huobi-token,chiliz,crypto-com-chain,okb,pancakeswap&vs_currencies=usd'
    );
    if (response.data) {
      cryptoRatesCache = {
        BTC: response.data.bitcoin?.usd || null,
        ETH: response.data.ethereum?.usd || null,
        ADA: response.data.cardano?.usd || null,
        BNB: response.data.binancecoin?.usd || null,
        SOL: response.data.solana?.usd || null,
        XRP: response.data.ripple?.usd || null,
        DOGE: response.data.dogecoin?.usd || null,
        DOT: response.data.polkadot?.usd || null,
        LTC: response.data.litecoin?.usd || null,
        TRX: response.data.tron?.usd || null,
        SHIB: response.data['shiba-inu']?.usd || null,
        LINK: response.data.chainlink?.usd || null,
        XLM: response.data.stellar?.usd || null,
        XMR: response.data.monero?.usd || null,
        SAND: response.data['the-sandbox']?.usd || null,
        ATOM: response.data.cosmos?.usd || null,
        ALGO: response.data.algorand?.usd || null,
        VET: response.data.vechain?.usd || null,
        XTZ: response.data.tezos?.usd || null,
        APE: response.data.apecoin?.usd || null,
        MANA: response.data.decentraland?.usd || null,
        AXS: response.data['axie-infinity']?.usd || null,
        FIL: response.data.filecoin?.usd || null,
        ZEC: response.data.zcash?.usd || null,
        UNI: response.data.uniswap?.usd || null,
        LUNA: response.data["terra-luna"]?.usd || null,
        FTT: response.data["ftx-token"]?.usd || null,
        GRT: response.data["the-graph"]?.usd || null,
        FTM: response.data.fantom?.usd || null,
        KCS: response.data["kucoin-shares"]?.usd || null,
        HT: response.data["huobi-token"]?.usd || null,
        CHZ: response.data.chiliz?.usd || null,
        CRO: response.data["crypto-com-chain"]?.usd || null,
        OKB: response.data.okb?.usd || null,
        

      };
      lastUpdatedCrypto = new Date();
      console.log('Caché de criptomonedas actualizada:', cryptoRatesCache);
    } else {
      throw new Error('Datos de respuesta inválidos para criptomonedas.');
    }
  } catch (error) {
    console.error('Error al actualizar tipos de cambio de criptomonedas:', error.message);
  }
};

// Programar actualizaciones periódicas
setInterval(async () => {
  console.log('Iniciando actualización programada de tipos de cambio tradicionales...');
  await updateExchangeRates();
}, UPDATE_INTERVAL_TRADITIONAL);

setInterval(async () => {
  console.log('Iniciando actualización programada de tipos de cambio de criptomonedas...');
  await updateCryptoRates();
}, UPDATE_INTERVAL_CRYPTO);

// Función para obtener tipo de cambio desde la caché
const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  try {
    console.log(`Intentando convertir de ${fromCurrency} a ${toCurrency}...`);

    // Validar entrada
    if (!fromCurrency || !toCurrency) {
      throw new Error('Las monedas de origen y destino son obligatorias.');
    }

    const isCryptoFrom = cryptoRatesCache[fromCurrency];
    const isCryptoTo = cryptoRatesCache[toCurrency];

    if (isCryptoFrom || isCryptoTo) {
      // Manejo de criptomonedas
      const fromRate = cryptoRatesCache[fromCurrency] || (1 / exchangeRatesCache[fromCurrency]);
      const toRate = cryptoRatesCache[toCurrency] || (1 / exchangeRatesCache[toCurrency]);
      console.log('Tasas de cambio utilizadas (criptomonedas):', { fromRate, toRate });

      if (!fromRate || !toRate) {
        throw new Error(`La moneda ${fromCurrency} o ${toCurrency} no está disponible en la caché.`);
      }
      return fromRate / toRate; // CORREGIDO: Relación directa de tasas de cambio
    }

    // Manejo de monedas tradicionales
    if (!exchangeRatesCache[fromCurrency] || !exchangeRatesCache[toCurrency]) {
      throw new Error(`La moneda ${fromCurrency} o ${toCurrency} no está disponible en la caché.`);
    }
    console.log('Tasas de cambio utilizadas (monedas tradicionales):', {
      from: exchangeRatesCache[fromCurrency],
      to: exchangeRatesCache[toCurrency],
    });
    return exchangeRatesCache[fromCurrency] / exchangeRatesCache[toCurrency]; // CORREGIDO: Relación directa
  } catch (error) {
    console.error('Error al obtener la tasa de cambio desde la caché:', error.message);
    throw error;
  }
};

// Inicializa la caché al inicio
(async () => {
  try {
    console.log('Inicializando la caché al inicio...');
    await updateExchangeRates();
    await updateCryptoRates();
  } catch (error) {
    console.error('Error al inicializar las cachés:', error.message);
  }
})();

module.exports = {
  updateExchangeRates,
  updateCryptoRates,
  getCachedExchangeRate,
  exchangeRatesCache,
  cryptoRatesCache,
  lastUpdatedTraditional,
  lastUpdatedCrypto,
};
