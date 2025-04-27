import express from 'express';
import contactoCollection from '../mongodb/models/contacto.model.js';
const router = express.Router();

router.post('/contactos', async (req, res) => {
  try {
    console.log('POST /contactos', req.body);
    const { nombre, email, fechaNacimiento } = req.body;

    if (!nombre || !email || !fechaNacimiento) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoContacto = {
      nombre,
      email,
      fechaNacimiento: new Date(fechaNacimiento)
    };

    const result = await contactoCollection.insertOne(nuevoContacto);
    res.json({ mensaje: 'Contacto agregado', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
