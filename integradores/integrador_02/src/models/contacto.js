// src/models/contacto.js
import mongoose from 'mongoose';

const contactoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    comentario: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Contacto', contactoSchema, 'contactos');
