// src/routes/mensajes.routes.js
import express from 'express';
import Contacto from '../models/contacto.js';
import { tiempoTranscurrido } from '../utils/funciones.js';

const router = express.Router();

// ✅ Mostrar últimos 10 mensajes no leídos (solo admin)
router.get('/mensajes', async (req, res) => {
    const user = req.session.user;

    if (!user || user.rol !== 'ROLE_ADMINISTRADOR') {
        return res.redirect(`${res.locals.basedir}/login`);
    }

    try {
        const contactos = await Contacto.find({ leido: false })
            .sort({ fecha: -1 })
            .limit(10)
            .lean()
            ;

        const contactosConTiempo = contactos.map(contacto => ({
            ...contacto,
            tiempo: tiempoTranscurrido(contacto.fecha)
        }));

        res.render('mensajes', {
            user,
            contactosConTiempo,
            extraCss: '/css/mensajes.css'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener mensajes');
    }
});

export default router;
