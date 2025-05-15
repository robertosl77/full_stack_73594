// src/routes/alta.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Producto from '../models/producto.js';
import fs from 'fs/promises';

const router = express.Router();
const upload = multer({ dest: 'public/img_temp' }); // Carpeta temporal

// GET form alta
router.get('/alta', (req, res) => {
  res.render('altaProducto', { basedir: process.env.BASEDIR });
});

// POST guardar producto
router.post('/alta', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, bodega, tipo, precio_original, descuento = 0, stock = 0 } = req.body;

    // Verificar nombre duplicado
    const existente = await Producto.findOne({ nombre });
    if (existente) {
      return res.status(400).send('El nombre ya existe');
    }

    // Crear producto sin imagen
    const nuevoProducto = new Producto({
      nombre,
      bodega,
      tipo,
      precio_original: parseFloat(precio_original),
      descuento: parseFloat(descuento),
      stock: parseInt(stock),
      estado: true
    });

    await nuevoProducto.save();

    // Obtener extensión original
    const ext = path.extname(req.file.originalname);
    const nuevoNombre = `${nuevoProducto._id}${ext}`;
    const nuevaRuta = path.join('public', 'img_productos', nuevoNombre);

    // Mover imagen
    await fs.rename(req.file.path, nuevaRuta);

    // Actualizar campo imagen
    nuevoProducto.imagen = `img_productos/${nuevoNombre}`;
    await nuevoProducto.save();

    res.redirect(`${process.env.BASEDIR}/productos`);
  } catch (err) {
    console.error('Error al guardar producto:', err);
    res.status(500).send('Error interno');
  }
});

export default router;
