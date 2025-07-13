// src/routes/contacto.routes.js
import express from 'express';
import Contacto from '../models/contacto.js';
import { verificarToken, permitirSolo } from '../utils/token.js';

const router = express.Router();

// ✅ POST: Guardar contacto enviado
router.post('/api/contacto', async (req, res) => {
  const { nombre, email, comentario } = req.body;

  if (!nombre || !email || !comentario) {
    return res.status(400).json({ error: 'Faltaron datos de ingreso.' });
  }

  try {
    await Contacto.create({ nombre, email, comentario });
    res.json({ success: 'Tu mensaje fue enviado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al enviar tu mensaje.' });
  }
});

// ✅ GET: Obtener últimos 10 contactos (admin)
router.get(
  '/api/ultimosContactos',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR']),
  async (req, res) => {
    try {
      const contactos = await Contacto.find()
        .sort({ fecha: -1 })
        .limit(10)
        .lean();

      res.json({ contactos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener contactos' });
    }
  }
);

export default router;
