// src/routes/mensajes.routes.js
import express from 'express';
import Contacto from '../models/contacto.js';
import { tiempoTranscurrido } from '../utils/funciones.js';
import { verificarToken, permitirSolo } from '../utils/token.js';
import { enviarEmail } from '../utils/email.js';

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

// GET /api/mensajes-con-respuestas  → últimos 10 (sin filtros nuevos)
router.get(
  '/api/mensajes-con-respuestas',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const limite = Number(req.query.limite) || 10;          // default 10

      const contactos = await Contacto.find()                 // ← SIN filtro extra
        .sort({ fecha: -1 })
        .limit(limite)
        .lean();

      const mensajes = contactos.map(c => ({
        ...c,
        tiempo: tiempoTranscurrido(c.fecha),
        respuestas: (c.respuestas || []).map(r => ({
          ...r,
          tiempoRespuesta: tiempoTranscurrido(r.fecha)
        }))
      }));

      res.json({ mensajes, cantidadMensajes: mensajes.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener mensajes' });
    }
  }
);


// PATCH /api/mensajes/:id/leido – Marcar como leído
router.patch(
  '/api/mensajes/:id/leido',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const { id } = req.params;
      await Contacto.findByIdAndUpdate(id, { leido: true });
      res.json({ success: 'Mensaje marcado como leído' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al marcar como leído' });
    }
  }
);

// POST /api/mensajes/responder – Enviar respuesta por email
router.post(
  '/api/mensajes/responder',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    const { email, nombre, asunto, mensaje, id } = req.body;

    if (!email || !nombre || !asunto || !mensaje || !id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    try {
      await enviarEmail({
        to: email,
        subject: asunto,
        text: mensaje
      });

      await Contacto.findByIdAndUpdate(id, {
        respondido: true,
        $push: {
          respuestas: {
            fecha: new Date(),
            usuario: req.user.usuario,
            mensaje
          }
        }
      });      

      res.json({ success: 'Respuesta enviada y registrada correctamente.' });

    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      res.status(500).json({ error: 'No se pudo enviar el email.' });
    }
  }
);


export default router;
