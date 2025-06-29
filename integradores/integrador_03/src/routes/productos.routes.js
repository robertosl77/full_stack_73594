// src/routes/productos.routes.js
import express from 'express';
import { validaImagenProductos, obtenerProductosConDescuento } from '../utils/funciones.js';
import Carrito from '../models/carrito.js';

const router = express.Router();

// GET productos (mostrar cards)
router.get('/productos', async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect(`${res.locals.basedir}/login`);
    }

    try {
        let productos = await obtenerProductosConDescuento();
        productos = validaImagenProductos(productos);

        const carrito = await Carrito.findOne({ usuario: user._id });
        const productosActivos = carrito
            ? carrito.productos.filter(p => p.estado === 1 || p.estado === 2)
            : [];

        const tieneCarrito = productosActivos.length > 0;
        const cantidadCarrito = productosActivos.length;

        res.render('productos', {
            productos,
            extraCss: '/css/productos.css',
            user,
            tieneCarrito,
            cantidadCarrito
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;
