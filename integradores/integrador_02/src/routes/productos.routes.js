// src/routes/productos.routes.js
import express from 'express';
import { obtenerProductosConDescuento } from '../services/productoService.js';
import { validaImagenProductos } from '../utils/funciones.js';

const router = express.Router();

// GET productos (mostrar cards)
router.get('/productos', async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect(`${res.locals.basedir}/login`);
    }

    try {
        let productos = await obtenerProductosConDescuento();
        productos= validaImagenProductos(productos);
        const user = req.session.user;
        res.render('productos', {
            productos,
            extraCss: '/css/productos.css',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;
