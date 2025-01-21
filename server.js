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
// Define el puerto en el que se ejecutará la aplicación
// Usa el puerto especificado en las variables de entorno o, si no está definido, el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`); // Muestra un mensaje en la consola indicando que el servidor está en funcionamiento
});
