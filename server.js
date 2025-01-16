const app = require('./app'); // Importa la configuración de la aplicación desde el archivo app.js

// Define el puerto en el que se ejecutará la aplicación
// Usa el puerto especificado en las variables de entorno o, si no está definido, el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`); // Muestra un mensaje en la consola indicando que el servidor está en funcionamiento
});
