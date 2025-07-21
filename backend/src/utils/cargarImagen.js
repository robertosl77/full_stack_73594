import fs from 'fs';
import path from 'path';

// Función para cargar la imagen
export function cargarImagen(file, producto) {
  if (!file) {
    throw new Error('No se proporcionó ninguna imagen');
  }

  // Obtener la extensión original del archivo
  const extension = path.extname(file.originalname).toLowerCase();
  // Validar que sea una extensión de imagen permitida
  const extensionesPermitidas = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  if (!extensionesPermitidas.includes(extension)) {
    throw new Error('Formato de imagen no permitido');
  }

  // Generar un nombre de archivo único (usando el ID del producto)
  const nombreArchivo = `${producto._id}${extension}`;
  const rutaDestino = path.join(process.cwd(), 'public', 'img_productos', nombreArchivo);

  // Mover el archivo a la carpeta de destino
  fs.renameSync(file.path, rutaDestino);

  // Asignar la ruta relativa al campo imagen del producto
  producto.imagen = `img_productos/${nombreArchivo}`;
}