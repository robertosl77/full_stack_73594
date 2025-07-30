// src/models/contacto.js
import mongoose from 'mongoose';

const respuestaSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  usuario: { type: String, required: true },
  mensaje: { type: String, required: true }
}, { _id: false }); // opcional: evita generar _id en cada respuesta

const contactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  comentario: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false },
  respondido: { type: Boolean, default: false },

  // 🔁 Respuestas múltiples
  respuestas: [respuestaSchema]
});

export default mongoose.model('Contacto', contactoSchema, 'contactos');
