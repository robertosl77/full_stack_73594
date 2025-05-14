// src/routes/contacto.routes.js
import express from 'express';
import Contacto from '../models/contacto.js';

const router = express.Router();

// Mostrar formulario de contacto
router.get('/contacto', (req, res) => {
    res.render('contacto', {
        user: req.session.user,
        extraCss: '/css/contacto.css'
    });
});

// Guardar contacto enviado
router.post('/contacto', async (req, res) => {
console.log(req.body);
    const { nombre, email, comentario } = req.body;

    if (!nombre || !email || !comentario) {
        res.render('contacto', {
            user: req.session.user,
            extraCss: '/css/contacto.css',
            error: 'Faltaron datos de ingreso.'
        });
        return;
    }

    try {
        await Contacto.create({ nombre, email, comentario });
        res.render('contacto', {
            user: req.session.user,
            extraCss: '/css/contacto.css',
            success: 'Tu mensaje fue enviado correctamente.'
        });
    } catch (error) {
        console.error(error);
        res.render('contacto', {
            user: req.session.user,
            extraCss: '/css/contacto.css',
            error: 'Hubo un error al enviar tu mensaje.'
        });
    }
});

// 👉 API: obtener últimos 10 contactos (ordenados descendente)
router.get('/api/ultimosContactos', async (req, res) => {
    try {
        const contactos = await Contacto.find()
            .sort({ fecha: -1 })        // 👉 Ordenar por fecha descendente
            .limit(10);                  // 👉 Limitar a 10 resultados

        res.json(contactos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
});

export default router;
