// npm install bcrypt
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

const usuarioSchema = new mongoose.Schema({
    usuario: String,
    password: String,
    nombre: String,
    apellido: String,
    email: String
});

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

async function cargarUsuarios() {
    const usuarios = [
        { usuario: 'admin', password: 'admin123', nombre: 'Roberto', apellido: 'SL', email: 'admin@example.com' },
        { usuario: 'user1', password: 'user123', nombre: 'Juan', apellido: 'Perez', email: 'juan@example.com' },
        { usuario: 'user2', password: 'user456', nombre: 'Maria', apellido: 'Gomez', email: 'maria@example.com' }
    ];

    for (const u of usuarios) {
        const hash = await bcrypt.hash(u.password, 10);
        await Usuario.create({ ...u, password: hash });
    }

    console.log('Usuarios insertados correctamente');
    mongoose.disconnect();
}

cargarUsuarios();
