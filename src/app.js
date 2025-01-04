// Importar el módulo Express
const express = require('express');
// Crear una instancia de un enrutador de Express
const router = express.Router();
// Importar la caché de criptomonedas desde el servicio
const { cryptoRatesCache } = require('./services/cacheService'); 

// Definir la ruta principal para cargar la página inicial
router.get('/', (req, res) => {
  try {
    // Verificar si la caché de criptomonedas está vacía o no existe
    if (!cryptoRatesCache || Object.keys(cryptoRatesCache).length === 0) {
      console.log('La caché de criptomonedas está vacía.');
      // Renderizar la vista 'index' con un título, subtítulo y sin opciones de criptomonedas
      return res.render('index', {
        title: 'Conversor de Divisas y Criptomonedas', // Título de la página
        subtitle: 'Convierte entre monedas tradicionales y criptomonedas en tiempo real.', // Subtítulo de la página
        cryptoOptions: [], // Enviar una lista vacía de opciones al template
      });
    }

    // Formatear las criptomonedas desde la caché para enviarlas al template
    const cryptoOptions = Object.entries(cryptoRatesCache).map(([symbol, rate]) => ({
      symbol, // Símbolo de la criptomoneda
      rate: rate.toFixed(2), // Precio de la criptomoneda formateado con 2 decimales
    }));

    // Imprimir las opciones formateadas en la consola para depuración
    console.log('Opciones formateadas para el template:', cryptoOptions);

    // Renderizar la vista 'index' con las opciones formateadas
    res.render('index', {
      title: 'Conversor de Divisas y Criptomonedas', // Título de la página
      subtitle: 'Convierte entre monedas tradicionales y criptomonedas en tiempo real.', // Subtítulo de la página
      cryptoOptions, // Pasar las opciones formateadas al template
    });
  } catch (error) {
    // Manejar cualquier error ocurrido al procesar la caché
    console.error('Error al procesar la caché para el template:', error.message);
    // Renderizar la vista 'error' con un mensaje descriptivo
    res.render('error', { message: 'Hubo un problema al cargar las criptomonedas.' });
  }
});

// Exportar el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = router;
