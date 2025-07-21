// src/routes/abm.routes.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import Producto from '../models/producto.js';
import { verificarToken, permitirSolo } from '../utils/token.js';
import { cargarImagen } from '../utils/cargarImagen.js';
import { validarNumero, obtenerCampoFinal } from '../utils/productoUtils.js';
import upload from '../middleware/multerImagen.js';

const router = express.Router();

// GET lista de productos (ADMIN)
router.get(
  '/api/abm',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const productos = await Producto.find().sort({ nombre: 1 }).lean();
      res.json({ success: true, productos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }
);

// POST modifica producto
router.post(
  '/api/abm/modifica',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  upload.single('imagen'),
  async (req, res) => {
    try {
      const { id, nombre, bodega, tipo, precio_original, descuento = 0, stock = 0 } = req.body;
      if (!id || !nombre || !bodega || !tipo || !precio_original) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      const producto = await Producto.findById(id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

      // Si hay nueva imagen, eliminar la anterior
      if (req.file) {
        if (producto.imagen) {
          const vieja = path.join(process.cwd(), 'public', producto.imagen);
          if (fs.existsSync(vieja)) fs.unlinkSync(vieja);
        }

        cargarImagen(req.file, producto); // asigna nueva imagen
      }

      // Validar y actualizar campos
      producto.nombre = nombre.trim();
      producto.bodega = obtenerCampoFinal(bodega, req.body.bodegaOtro);
      producto.tipo = obtenerCampoFinal(tipo, req.body.tipoOtro);
      producto.precio_original = validarNumero(precio_original, 'Precio original', { min: 0 });
      producto.descuento = validarNumero(descuento, 'Descuento', { min: 0, max: 100 });
      producto.stock = validarNumero(stock, 'Stock', { min: 0 });

      await producto.save();

      res.json({ success: 'Producto actualizado correctamente', producto });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al modificar producto' });
    }
  }
);

// POST elimina producto
router.post(
  '/api/abm/elimina',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const { id } = req.body;
      const producto = await Producto.findById(id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

      // Eliminar imagen si existe
      if (producto.imagen) {
        const ruta = path.join(process.cwd(), 'public', producto.imagen);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      }

      await Producto.findByIdAndDelete(id);
      res.json({ success: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
);

// POST deshabilita producto (deja imagen, stock 0)
router.post(
  '/api/abm/deshabilita',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const { id } = req.body;
      const producto = await Producto.findById(id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

      producto.stock = 0;
      await producto.save();

      res.json({ success: 'Producto deshabilitado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al deshabilitar producto' });
    }
  }
);

export default router;
