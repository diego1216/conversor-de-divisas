const axios = require('axios'); // Importa la librería axios para realizar solicitudes HTTP.

<<<<<<< Updated upstream
<<<<<<< Updated upstream
let cryptoRatesCache = {}; // Declara un objeto para almacenar las tasas de cambio de las criptomonedas en caché.

const fetchCryptoRates = async (page = 1) => { // Define una función asíncrona para obtener tasas de criptomonedas por página.
  try {
    console.log(`Fetching page ${page} of cryptocurrencies...`); // Muestra un mensaje en la consola indicando la página que se está cargando.
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', { // Realiza una solicitud GET a la API de CoinGecko para obtener datos de las criptomonedas.
      params: { // Parámetros de consulta que se envían junto con la solicitud.
        vs_currency: 'usd', // Define que las tasas de cambio se obtendrán en dólares estadounidenses.
        per_page: 30, // Especifica el número máximo de criptomonedas por página (30 en este caso).
        page: page, // Indica la página que se está solicitando.
      },
    });

    if (response.data && response.data.length > 0) { // Verifica si la respuesta contiene datos y si no está vacía.
      response.data.forEach((crypto) => { // Itera sobre la lista de criptomonedas obtenidas.
        cryptoRatesCache[crypto.symbol.toUpperCase()] = crypto.current_price; // Agrega cada criptomoneda al caché usando su símbolo en mayúsculas como clave.
      });
      console.log(`Page ${page} loaded successfully.`); // Muestra un mensaje indicando que la página se cargó correctamente.
      return response.data.length; // Devuelve el número de elementos obtenidos en esta página.
    }
    return 0; // Si no hay datos, devuelve 0 para indicar que no hay más elementos.
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error.message); // Muestra un mensaje de error en caso de fallo en la solicitud.
    return 0; // Devuelve 0 para detener la iteración en caso de error.
  }
};

const updateCryptoRates = async () => { // Define una función asíncrona para actualizar todas las tasas de criptomonedas.
  console.log('Iniciando la actualización de criptomonedas...'); // Muestra un mensaje en la consola al iniciar la actualización.
  cryptoRatesCache = {}; // Limpia el caché antes de comenzar a cargar nuevos datos.
  let page = 1; // Inicializa la variable de página con el valor 1.
  let fetchedItems; // Variable para almacenar el número de elementos obtenidos en cada página.

  do {
    fetchedItems = await fetchCryptoRates(page); // Llama a `fetchCryptoRates` para obtener datos de la página actual.
    page++; // Incrementa el número de página para la siguiente iteración.
  } while (fetchedItems === 30); // Continúa iterando mientras se obtengan exactamente 30 elementos por página (indica que podría haber más datos).

  console.log('Actualización completa. Criptomonedas cargadas:', Object.keys(cryptoRatesCache).length); // Muestra un mensaje indicando la cantidad total de criptomonedas cargadas en el caché.
  console.log('Contenido de cryptoRatesCache:', cryptoRatesCache); // Imprime el contenido completo del caché en la consola.
};

module.exports = {
  cryptoRatesCache, // Exporta el objeto `cryptoRatesCache` para que pueda ser utilizado en otros módulos.
  updateCryptoRates, // Exporta la función `updateCryptoRates` para que pueda ser llamada desde otros módulos.
=======
=======
>>>>>>> Stashed changes
// Variables para almacenar en caché
let cryptoRatesCache = {};
let exchangeRatesCache = {};

// Función para limpiar la caché
const clearCache = () => {
  cryptoRatesCache = {};
  exchangeRatesCache = {};
  console.log('La caché ha sido limpiada.');
};

// Función para actualizar las tasas de criptomonedas
const updateCryptoRates = async () => {
  try {
    console.log('Iniciando actualización de tasas de criptomonedas...');
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', per_page: 50 },
    });

    // Actualizar la caché de criptomonedas
    cryptoRatesCache = response.data.reduce((acc, coin) => {
      acc[coin.symbol.toUpperCase()] = {
        id: coin.id,
        name: coin.name,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
      };
      return acc;
    }, {});
    console.log('Tasas de criptomonedas actualizadas.');
  } catch (error) {
    console.error('Error al actualizar tasas de criptomonedas:', error.message);
  }
};

// Función para actualizar las tasas de monedas tradicionales
const updateExchangeRates = async () => {
  try {
    console.log('Iniciando actualización de tasas de monedas tradicionales...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');

    // Actualizar la caché de monedas tradicionales
    exchangeRatesCache = response.data.rates;
    console.log('Tasas de monedas tradicionales actualizadas.');
  } catch (error) {
    console.error('Error al actualizar tasas de monedas tradicionales:', error.message);
  }
};

// Obtener las tasas de cambio desde la caché
const getCachedCurrencies = () => {
  const cryptocurrencies = Object.keys(cryptoRatesCache).map((key) => ({
    symbol: key,
    ...cryptoRatesCache[key],
  }));

  const fiatCurrencies = Object.keys(exchangeRatesCache).map((key) => ({
    symbol: key,
    name: key.toUpperCase(),
    rate: exchangeRatesCache[key],
  }));

  return { cryptocurrencies, fiatCurrencies };
};

// Obtener la tasa de cambio entre dos monedas desde la caché
const getCachedExchangeRate = (fromCurrency, toCurrency) => {
  const isCryptoFrom = cryptoRatesCache[fromCurrency];
  const isCryptoTo = cryptoRatesCache[toCurrency];

  if (isCryptoFrom || isCryptoTo) {
    const fromRate = isCryptoFrom ? isCryptoFrom.current_price : 1 / exchangeRatesCache[fromCurrency];
    const toRate = isCryptoTo ? isCryptoTo.current_price : 1 / exchangeRatesCache[toCurrency];
    return fromRate / toRate;
  }

  if (!exchangeRatesCache[fromCurrency] || !exchangeRatesCache[toCurrency]) {
    throw new Error(`No se encontraron tasas de cambio para ${fromCurrency} o ${toCurrency}.`);
  }

  return exchangeRatesCache[toCurrency] / exchangeRatesCache[fromCurrency];
};

// Inicializar la caché al iniciar el servidor
(async () => {
  console.log('Inicializando la caché...');
  await updateCryptoRates();
  await updateExchangeRates();

  // Programar actualizaciones periódicas
  setInterval(updateCryptoRates, 30 * 1000); // Cada 30 segundos
  setInterval(updateExchangeRates, 30 * 1000); // Cada 30 segundos

  // Limpiar y actualizar la caché cada 20 minutos
  setInterval(async () => {
    clearCache();
    await updateCryptoRates();
    await updateExchangeRates();
  }, 28 * 1000); // Cada 20 segundos
})();

module.exports = {
  updateCryptoRates,
  updateExchangeRates,
  getCachedCurrencies,
  getCachedExchangeRate,
>>>>>>> Stashed changes
};
