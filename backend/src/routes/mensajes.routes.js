// src/routes/mensajes.routes.js
import express from 'express';
import Contacto from '../models/contacto.js';
import { tiempoTranscurrido } from '../utils/funciones.js';
import { verificarToken, permitirSolo } from '../utils/token.js';

const router = express.Router();

// GET últimos 10 mensajes no leídos (solo admin)
router.get(
  '/api/mensajes',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const contactos = await Contacto.find({ leido: false })
        .sort({ fecha: -1 })
        .limit(10)
        .lean();

      const contactosConTiempo = contactos.map(contacto => ({
        ...contacto,
        tiempo: tiempoTranscurrido(contacto.fecha),
      }));

      res.json({
        mensajes: contactosConTiempo,
        cantidadMensajes: contactosConTiempo.length,
        esSoloVista: req.user.rol === 'ROLE_CONSULTA',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener mensajes' });
    }
  }
);

export default router;
