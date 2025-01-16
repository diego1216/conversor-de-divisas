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

currency-converter/
├── public/                       # Archivos estáticos
│   ├── css/
│   │   ├── styles.css
│   │   └── styles.css.map
│   ├── js/
│   │   └── main.js
├── src/
│   ├── controllers/              # Lógica de las rutas
│   │   ├── conversionController.js
│   │   └── comparisonController.js
│   ├── models/                   # Lógica del negocio
│   │   ├── currencyModel.js
│   │   └── cryptoModel.js
│   ├── services/                 # Servicios externos o caché
│   │   ├── cacheService.js
│   │   ├── cryptoService.js
│   │   └── exchangeRates.js
│   ├── views/                    # Plantillas Pug
│   │   ├── cryptoDetails.pug
│   │   ├── error.pug
│   │   ├── index.pug
│   │   └── layout.pug
│   ├── routes/                   # Rutas principales
│   │   └── index.js
│   └── sass/
│       └── styles.scss           # Archivos Sass
├── .env                          # Variables de entorno
├── app.js                        # Configuración inicial de la app
├── server.js                     # Arranque del servidor
├── package.json                  # Dependencias y scripts
├── README.md                     # Documentación del proyecto
