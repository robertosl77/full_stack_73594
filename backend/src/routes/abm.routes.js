// src/routes/abmProductos.routes.js
import express from 'express';
import Producto from '../models/producto.js';
import { validaImagenProductos } from '../utils/funciones.js';
import { verificarToken, permitirSolo } from '../utils/token.js';
import { cargarImagen } from '../utils/cargarImagen.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imágenes.'));
  }
});

const router = express.Router();

router.get(
  '/api/admin/abmProductos',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      let productos = await Producto.find().sort({ nombre: 1 }).lean();
      productos = validaImagenProductos(productos);

      res.json({ productos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }
);

router.put(
  '/api/admin/abmProductos/:id',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  upload.single('nuevaImagen'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { precio_original, descuento, stock, estado } = req.body;
      const producto = await Producto.findById(id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

      const precio = parseFloat(precio_original);
      const desc = parseFloat(descuento);
      const st = parseInt(stock);
      const est = estado === 'true' || estado === true;

      if (isNaN(precio) || isNaN(desc) || isNaN(st)) {
        return res.status(400).json({ error: 'Datos inválidos' });
      }

      producto.precio_original = precio;
      producto.descuento = desc;
      producto.stock = st;
      producto.estado = est;

      if (req.file) {
        cargarImagen(req.file, producto);
      }

      await producto.save();
      res.json({ ok: true, productoActualizado: producto });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }
);

export default router;
