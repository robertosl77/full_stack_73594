// src/routes/abmProductos.routes.js
import express from 'express';
import Producto from '../models/producto.js';
import { validaImagenProductos } from '../utils/funciones.js';
import { verificarToken, permitirSolo } from '../utils/token.js';

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

export default router;
