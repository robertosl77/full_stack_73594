import express from 'express';
import redirectMiddleware from './middleware/app.redirect.js';
import { BASE_PATH } from './config/config.js';
import testRouter from './api/test.js';

const app = express();

app.use(BASE_PATH, testRouter);

// Redirección de raíz a carpeta base
app.get('/', redirectMiddleware);

// Ruta principal dentro de carpeta base
app.get(BASE_PATH+'/', (req, res) => {
    res.send('Hola, mundo');
});



export default app;
