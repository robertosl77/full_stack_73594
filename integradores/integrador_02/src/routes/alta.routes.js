// src/routes/alta.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Producto from '../models/producto.js';
import fs from 'fs/promises';

const router = express.Router();

// Carpeta temporal
const upload = multer({ 
  dest: 'public/img_temp',
  fileFilter: (req, file, cb) => {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (tiposValidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, png, webp)'));
    }
  }
});

// GET form alta
router.get('/alta', async (req, res) => {
  try {
    const nombresExistentes = await getProductos('nombre');
    const bodegasExistentes = await getProductos('bodega');
    const tiposExistentes = await getProductos('tipo');
    res.render('altaProducto', {
        basedir: process.env.BASEDIR,
        extraCss: '/css/alta.css',
        nombresExistentes: JSON.stringify(nombresExistentes),
        bodegasExistentes, // Para el select
        bodegasJSON: JSON.stringify(bodegasExistentes), // Para el script    
        tiposExistentes, // Para el select
        tiposJSON: JSON.stringify(tiposExistentes) // Para el script
    });
  } catch (err) {
    console.error('Error cargando nombres:', err);
    res.status(500).send('Error interno');
  }
});

// POST guardar producto
router.post('/alta', (req, res, next) => {
  upload.single('imagen')(req, res, function (err) {
    if (err) {
      return res.render('altaProducto', {
        basedir: process.env.BASEDIR,
        errorImagen: err.message // ejemplo: "Solo se permiten imágenes (jpeg, png, webp)"
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { nombre, bodega, tipo, precio_original, descuento = 0, stock = 0 } = req.body;

    const existente = await Producto.findOne({ nombre });
    if (existente) {
      return res.render('altaProducto', {
        basedir: process.env.BASEDIR,
        extraCss: '/css/alta.css',
        errorImagen: 'El nombre del producto ya existe'
      });
    }

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

    const ext = path.extname(req.file.originalname);
    const nuevoNombre = `${nuevoProducto._id}${ext}`;
    const nuevaRuta = path.join('public', 'img_productos', nuevoNombre);

    await fs.rename(req.file.path, nuevaRuta);

    nuevoProducto.imagen = `img_productos/${nuevoNombre}`;
    await nuevoProducto.save();

    res.redirect(`${process.env.BASEDIR}/productos`);
  } catch (err) {
    console.error('Error al guardar producto:', err);
    res.status(500).send('Error interno');
  }
});

async function getProductos(campo) {
  const productos = await Producto.find({}, campo);
  const nombres = productos.map(p => p[campo]?.toLowerCase()).filter(Boolean);
  const unicos = [...new Set(nombres)].sort();
  return unicos;
}



export default router;
