const express = require('express');
const path = require('path');
const app = express();
const routes = require('./src/routes');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas
app.use('/', routes);

module.exports = app;
