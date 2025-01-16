const express = require('express'); // Importa el módulo de Express para crear la aplicación
const path = require('path'); // Importa el módulo de Path para manejar rutas de archivos y directorios
const app = express(); // Crea una instancia de la aplicación Express
const routes = require('./src/routes'); // Importa las rutas definidas en el directorio src/routes

// Middlewares
app.use(express.urlencoded({ extended: true })); // Middleware para procesar datos codificados en URL (formularios)
app.use(express.json()); // Middleware para procesar datos en formato JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde el directorio "public"

// Motor de vistas
app.set('view engine', 'pug'); // Configura Pug como el motor de plantillas para la aplicación
app.set('views', path.join(__dirname, 'src/views')); // Define el directorio donde se encuentran las vistas

// Rutas
app.use('/', routes); // Define las rutas principales para la aplicación, comenzando desde "/"

// Exporta la instancia de la aplicación para que pueda ser utilizada en otros archivos
module.exports = app;
