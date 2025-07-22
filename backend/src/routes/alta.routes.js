import express from 'express';
import Producto from '../models/producto.js';
import { verificarToken, permitirSolo } from '../utils/token.js';
import { cargarImagen } from '../utils/cargarImagen.js';
import { 
  obtenerCampoFinal, 
  validarNumero, 
  getAltaProductoContext 
} from '../utils/productoUtils.js';
import upload from '../middleware/multerImagen.js';

const router = express.Router();

// GET datos para formulario de alta (JSON)
router.get(
  '/api/alta',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const context = await getAltaProductoContext();
      res.status(200).json({
        success: true,
        data: context
      });
    } catch (err) {
      console.error('Error cargando datos:', err);
      res.status(500).json({
        error: 'Error al obtener datos para el formulario de alta'
      });
    }
  }
);

// POST guardar producto
router.post(
  '/api/alta',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  upload.single('imagen'),
  async (req, res) => {
    try {
      const { nombre, bodega, tipo, precio_original, descuento = 0, stock = 0 } = req.body;

      // Validar datos requeridos
      if (!nombre || !bodega || !tipo || !precio_original) {
        return res.status(400).json({
          error: 'Faltan datos requeridos: nombre, bodega, tipo o precio_original'
        });
      }

      // Validar números
      const precio = validarNumero(precio_original, 'Precio original', { min: 0 });
      const desc = validarNumero(descuento, 'Descuento', { min: 0, max: 100 });
      const st = validarNumero(stock, 'Stock', { min: 0 });

      // Verificar si el nombre del producto ya existe
      const existente = await Producto.findOne({ nombre });
      if (existente) {
        return res.status(400).send('El nombre del producto ya existe');
      }

      const bodegaFinal = obtenerCampoFinal(bodega, req.body.bodegaOtro);
      const tipoFinal = obtenerCampoFinal(tipo, req.body.tipoOtro);

      // Crear nuevo producto
      const nuevoProducto = new Producto({
        nombre,
        bodega: bodegaFinal,
        tipo: tipoFinal,
        precio_original: precio,
        descuento: desc,
        stock: st,
        estado: true
      });

      // Manejar la imagen si se subió
      if (req.file) {
        try {
          cargarImagen(req.file, nuevoProducto);
        } catch (error) {
          return res.status(400).json({
            error: `Error al procesar la imagen: ${error.message}`
          });
        }
      }

      // Guardar el producto
      await nuevoProducto.save();

      res.status(200).json({
        success: 'Producto creado correctamente',
        producto: nuevoProducto
      });
    } catch (err) {
      console.error('Error al guardar producto:', err);
      res.status(500).json({
        error: 'Error al crear el producto'
      });
    }
  }
);

export default router;