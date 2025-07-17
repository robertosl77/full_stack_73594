// src/utils/cargarImagen.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cargarImagen = (file, producto) => {
  if (!file || !file.mimetype.startsWith('image/')) {
    throw new Error('Archivo no válido');
  }

  const carpetaDestino = path.join(__dirname, '../public/img_productos');
  const ext = path.extname(file.originalname);
  const nombreFinal = `${producto._id}${ext}`;
  const rutaFinal = path.join(carpetaDestino, nombreFinal);

  // eliminar imagen anterior si no es la default
  if (
    producto.imagen &&
    producto.imagen !== 'img_productos/Imagen_no_disponible.svg.png'
  ) {
    const rutaAnterior = path.join(__dirname, '../public/', producto.imagen);
    if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
  }

  fs.renameSync(file.path, rutaFinal);
  producto.imagen = `img_productos/${nombreFinal}`;
};
