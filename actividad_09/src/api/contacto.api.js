import express from 'express';
import contactoCollection from '../mongodb/models/contacto.model.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/alta_contactos', async (req, res) => {
    try {
      const { nombre, email, fechaNacimiento } = req.body;
  
      if (!nombre || !email || !fechaNacimiento) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Validación de email duplicado
      const verificarEmailDuplicado = true; // Cambiá a false si querés desactivarlo
  
      if (verificarEmailDuplicado) {
        const existe = await contactoCollection.findOne({ email });
        if (existe) {
          return res.status(400).json({ error: 'El email ya está registrado' });
        }
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

router.delete('/baja_contactos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await contactoCollection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
      }
  
      res.json({ mensaje: 'Contacto eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get('/listar_contactos', async (req, res) => {
    try {
      const contactos = await contactoCollection.find({}).toArray();
      res.json(contactos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
