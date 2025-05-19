// src/routes/abm.routes.js
import express from 'express';
import Producto from '../models/producto.js';
import { validaImagenProductos } from '../utils/funciones.js';

const router = express.Router();

// ✅ Mostrar todos los productos (solo admin)
router.get('/admin/abm', async (req, res) => {
    const user = req.session.user;

    // Seguridad: solo admin
    if (!user || user.rol !== 'ROLE_ADMINISTRADOR') {
        return res.redirect(`${res.locals.basedir}/login`);
    }

    try {
        let productos = await Producto.find().sort({ nombre: 1 }).lean();
        productos = validaImagenProductos(productos);

        res.render('abm', {
            productos,
            user,
            extraCss: '/css/abm.css'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;
