const express = require('express');
const path = require('path');
const cron = require('node-cron'); // Importa el paquete node-cron para las tareas programadas
const { updateExchangeRates } = require('./src/services/cacheService'); // Servicio de caché
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = express();

// Configurar el directorio de vistas y el motor de plantillas
server.set('views', path.join(__dirname, 'src/views')); // Ruta de las vistas
server.set('view engine', 'pug');

// Servir archivos estáticos
server.use(express.static(path.join(__dirname, 'public')));

// Rutas principales
server.use('/', app);

// Configurar cron job para actualizar los tipos de cambio cada hora
cron.schedule('0 * * * *', async () => {
  console.log('Iniciando actualización de tipos de cambio...');
  await updateExchangeRates(); // Actualiza los tipos de cambio en la caché
  console.log('Tipos de cambio actualizados correctamente.');
});

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
