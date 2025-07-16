// src/routes/productos.routes.js
import express from 'express';
import { 
  validaImagenProductos, 
  obtenerProductosConDescuento, 
  ajustarStockConCarrito 
} from '../utils/funciones.js';
import Carrito from '../models/carrito.js';
import { verificarToken, permitirSolo } from '../utils/token.js';

const router = express.Router();

// GET productos (retorna JSON)
router.get(
  '/api/productos',
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE", "ROLE_CONSULTA"]),
  async (req, res) => {
    try {
      let productos = await obtenerProductosConDescuento();
      productos = validaImagenProductos(productos);

      const carrito = await Carrito.findOne({ usuario: req.user._id });
      productos = ajustarStockConCarrito(productos, carrito);

      const productosActivos = carrito
        ? carrito.productos.filter(p => p.estado === 1 || p.estado === 2)
        : [];

      res.json({
        productos,
        tieneCarrito: productosActivos.length > 0,
        cantidadCarrito: productosActivos.length,
        esSoloVista: req.user.rol === 'ROLE_CONSULTA'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }
);

export default router;
