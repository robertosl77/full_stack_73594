// src/routes/productos.routes.js
import express from 'express';
import { obtenerProductosConDescuento } from '../services/productoService.js';

const router = express.Router();

// GET productos (mostrar cards)
router.get('/productos', async (req, res) => {
    try {
        const productos = await obtenerProductosConDescuento();
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
