import express from 'express';
import redirectMiddleware from './middleware/app.redirect.js';
import { BASE_PATH } from './config/config.js';
// API
import testRouter from './api/test.js';
import contactoRouter from './api/contacto.api.js';
// healthcheck
import healthRouter from './healthcheck/hc.mongodb.js';
import dbValidationRouter from './healthcheck/hc.dbValidation.js';

const app = express();

app.use(express.json());

app.use(BASE_PATH, testRouter);
app.use(BASE_PATH, healthRouter);
app.use(BASE_PATH, dbValidationRouter);
app.use(BASE_PATH, contactoRouter);

// Redirección de raíz a carpeta base
app.get('/', redirectMiddleware);

// Ruta principal dentro de carpeta base
app.get(BASE_PATH+'/', (req, res) => {
    res.send('Hola, mundo');
});



export default app;
