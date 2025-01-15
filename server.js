const express = require('express');
const path = require('path');
const cron = require('node-cron'); // Importa el paquete node-cron para las tareas programadas
const { updateCryptoRates } = require('./src/services/cacheService'); // Servicio de caché
const app = require('./src/app');

const PORT = process.env.PORT || 3002;

const server = express();

<<<<<<< Updated upstream
// Configurar el directorio de vistas y el motor de plantillas
server.set('views', path.join(__dirname, 'src/views')); // Ruta de las vistas
server.set('view engine', 'pug');
=======
// Importar rutas
const routes = require('./src/routes');
app.use('/', routes);
>>>>>>> Stashed changes

// Servir archivos estáticos
server.use(express.static(path.join(__dirname, 'public')));

// Rutas principales
server.use('/', app);

// Configurar cron job para actualizar los tipos de cambio cada hora
cron.schedule('0 * * * *', async () => {
  console.log('Iniciando actualización de criptomonedas...');
  await updateCryptoRates(); // Actualiza las criptomonedas en la caché
  console.log('Actualización completa.');
});

// Inicia el servidor
server.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Cargando criptomonedas al iniciar...');
  await updateCryptoRates();
});
