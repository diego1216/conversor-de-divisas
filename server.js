const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Importar rutas
const routes = require('./routes'); // Asegúrate de que esta ruta sea correcta
app.use('/', routes); // Usa las rutas correctamente

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
