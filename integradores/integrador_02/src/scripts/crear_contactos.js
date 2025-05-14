// src/scripts/crear_contactos.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const contactoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    comentario: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

const Contacto = mongoose.model('Contacto', contactoSchema, 'contactos');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');

        // 👉 BORRAR TODOS LOS CONTACTOS EXISTENTES
        await Contacto.deleteMany({});
        console.log('Colección contactos vaciada');

        // 👉 Insertar contacto de ejemplo (opcional)
        const nuevoContacto = await Contacto.create({
            nombre: 'Roberto',
            email: 'roberto@example.com',
            comentario: 'Este es un mensaje de prueba'
        });

        console.log('Contacto de prueba insertado:', nuevoContacto);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
    }
}

run();
