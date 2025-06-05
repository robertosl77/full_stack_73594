// crear_usuario.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

const usuarioSchema = new mongoose.Schema({
    usuario: { type: String, unique: true },
    password: String,
    nombre: String,
    apellido: String,
    email: { type: String, unique: true },
    rol: { type: String, enum: ['ROLE_ADMINISTRADOR', 'ROLE_CLIENTE'], default: 'ROLE_CLIENTE' }
});

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

async function connectDB() {
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB');
}

async function disconnectDB() {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
}

async function crearUsuario() {
    const nuevoUsuario = {
        usuario: 'mgbenavides',
        password: '12345',
        nombre: 'Marcos',
        apellido: 'Gonzalez Benavides',
        email: 'mgbenavides@ejemplo.com',
        rol: 'ROLE_CLIENTE'
    };

    try {
        const existente = await Usuario.findOne({
            $or: [{ usuario: nuevoUsuario.usuario }, { email: nuevoUsuario.email }]
        });

        if (existente) {
            console.log('El usuario ya existe, no se insertó.');
        } else {
            const hash = await bcrypt.hash(nuevoUsuario.password, 10);
            await Usuario.create({ ...nuevoUsuario, password: hash });
            console.log(`Usuario ${nuevoUsuario.usuario} creado exitosamente.`);
        }
    } catch (err) {
        console.error('Error al crear usuario:', err);
    }
}

async function main() {
    try {
        await connectDB();
        await crearUsuario();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await disconnectDB();
    }
}

main();
