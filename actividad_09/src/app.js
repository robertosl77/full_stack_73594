import express from 'express';
import redirectMiddleware from './middleware/app.redirect.js';

const app = express();

// Redirección de raíz a /tp9
app.get('/', redirectMiddleware);

// Ruta principal dentro de /tp9
app.get('/tp9/', (req, res) => {
  res.send('Hola, mundo');
});

export default app;
