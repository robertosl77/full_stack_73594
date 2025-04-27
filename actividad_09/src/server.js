import app from './app.js';
import bd from './mongodb/db.js';

const PORT = process.env.PORT || 8080;

await bd.connect();
console.info('Conectado a MongoDB');

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/tp9`);
});

