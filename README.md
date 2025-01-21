# Conversor de Divisas y Criptomonedas en Tiempo Real

## Tecnologías Utilizadas
- Node.js
- Vanilla JS
- PUG
- Sass
- Axios

## Configuración
1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Crea un archivo `.env` con tu clave de API para Exchange Rate API.
4. Inicia el servidor con `npm start`.

## Uso
1. Accede a `http://localhost:3000`.
2. Ingresa la cantidad, moneda de origen y destino.
3. Visualiza el resultado de la conversión.
   nota:  la aplicación tarda 10 minutos en actualizar los datos de las cryptomonedas 

conversor-de-divisas/
├── node_modules/                 # Dependencias de Node.js
├── public/                       # Archivos estáticos
│   ├── css/
│   │   ├── styles.css            # Estilos CSS compilados
│   │   └── styles.css.map        # Mapa fuente para estilos
│   ├── js/
│   │   └── main.js               # Código JavaScript del frontend
├── src/
│   ├── controllers/              # Controladores para manejar la lógica de rutas
│   │   ├── comparisonController.js
│   │   ├── conversionController.js
│   │   ├── cryptoController.js
│   │   └── exchangeController.js
│   ├── models/                   # Modelos para lógica del negocio
│   │   ├── cacheModel.js
│   │   ├── cryptoModel.js
│   │   ├── currencyModel.js
│   │   └── exchangeModel.js
│   ├── services/                 # Servicios para API externas o lógica reutilizable
│   │   ├── cacheService.js
│   │   ├── cryptoService.js
│   │   └── exchangeRates.js
│   ├── routes/                   # Definición de rutas
│   │   ├── comparisonRoutes.js
│   │   ├── conversionRoutes.js
│   │   ├── exchangeRoutes.js
│   │   └── index.js
│   ├── views/                    # Plantillas para renderización con Pug
│   │   ├── cryptoDetails.pug
│   │   ├── error.pug
│   │   ├── index.pug
│   │   └── layout.pug
│   ├── sass/
│   │   └── styles.scss           # Archivo Sass para estilos
├── .env                          # Variables de entorno
├── app.js                        # Configuración principal de la aplicación
├── server.js                     # Arranque del servidor
├── package.json                  # Dependencias y scripts del proyecto
├── package-lock.json             # Versiones exactas de las dependencias
├── README.md                     # Documentación del proyecto
