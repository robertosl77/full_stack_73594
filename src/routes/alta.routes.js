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
    const user = req.session.user;

    if (!user || user.rol !== 'ROLE_ADMINISTRADOR') {
        return res.redirect(`${res.locals.basedir}/login`);
    }

    try {
    const context = await getAltaProductoContext({ user });
    res.render('altaProducto', context);
    } catch (err) {
    console.error('Error cargando datos:', err);
    res.status(500).send('Error interno');
    }
});

// POST guardar producto
router.post('/alta', (req, res, next) => {
    upload.single('imagen')(req, res, async function (err) {
    if (err) {
        try {
        const context = await getAltaProductoContext({
            errorImagen: err.message,
            user: req.session.user
        });
        return res.render('altaProducto', context);
        } catch (e) {
        console.error('Error preparando formulario tras fallo de imagen:', e);
        return res.status(500).send('Error interno al preparar el formulario');
        }
    }

    next(); // sigue al handler final si no hubo error
    });

}, async (req, res) => {
  try {
    const { nombre, bodega, tipo, precio_original, descuento = 0, stock = 0 } = req.body;

    const existente = await Producto.findOne({ nombre });
    if (existente) {
        try {
            const context = await getAltaProductoContext({
            errorImagen: 'El nombre del producto ya existe',
            user: req.session.user
            });
            return res.render('altaProducto', context);
        } catch (e) {
            console.error('Error al preparar el formulario tras nombre duplicado:', e);
            return res.status(500).send('Error interno');
        }
    }

    const bodegaFinal = obtenerCampoFinal(bodega, req.body.bodegaOtro);
    const tipoFinal = obtenerCampoFinal(tipo, req.body.tipoOtro);    

    const nuevoProducto = new Producto({
      nombre,
      bodega: bodegaFinal,
      tipo: tipoFinal,
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

function obtenerCampoFinal(valorSeleccionado, valorOtro) {
  if (valorSeleccionado === 'otro' && valorOtro?.trim()) {
    return valorOtro.trim();
  }
  return valorSeleccionado?.trim();
}

function validarNumero(valor, nombreCampo, { min = null, max = null } = {}) {
  const num = parseFloat(valor);
  if (isNaN(num)) throw new Error(`${nombreCampo} debe ser un número válido`);

  if (min !== null && num < min) throw new Error(`${nombreCampo} no puede ser menor que ${min}`);
  if (max !== null && num > max) throw new Error(`${nombreCampo} no puede ser mayor que ${max}`);

  return num;
}

async function getAltaProductoContext(extra = {}) {
  const nombresExistentes = await getProductos('nombre');
  const bodegasExistentes = await getProductos('bodega');
  const tiposExistentes = await getProductos('tipo');

  return {
    basedir: process.env.BASEDIR,
    extraCss: '/css/alta.css',
    nombresExistentes: JSON.stringify(nombresExistentes),
    bodegasExistentes,
    bodegasJSON: JSON.stringify(bodegasExistentes),
    tiposExistentes,
    tiposJSON: JSON.stringify(tiposExistentes),
    ...extra
  };
}





export default router;
