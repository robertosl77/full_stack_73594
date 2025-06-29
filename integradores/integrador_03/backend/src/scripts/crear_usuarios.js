// npm install bcrypt
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
    rol: { type: String, enum: ['ROLE_ADMINISTRADOR', 'ROLE_CLIENTE'], default: 'ROLE_CLIENTE' }   // 👈 agregado
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

async function resetUsuarios() {
    await Usuario.deleteMany({});
    console.log('Colección usuarios eliminada');
}

async function insertarUsuarios() {
    const usuarios = [
        { usuario: 'admin', password: '12345', nombre: 'Administrador', apellido: 'ROOT', email: 'admin@example.com', rol: 'ROLE_ADMINISTRADOR' },   // 👈 rol admin
        { usuario: 'robertosl77', password: '123', nombre: 'Roberto', apellido: 'SL', email: 'robertosl77@gmail.com', rol: 'ROLE_CLIENTE' },         // 👈 rol consulta
        { usuario: 'angeltano1709', password: '123', nombre: 'Angel Diego', apellido: 'Attaguile', email: 'example@example.com', rol: 'ROLE_CLIENTE' } // 👈 rol consulta
    ];

    for (const u of usuarios) {
        const existente = await Usuario.findOne({ $or: [{ usuario: u.usuario }, { email: u.email }] });
        if (!existente) {
            const hash = await bcrypt.hash(u.password, 10);
            await Usuario.create({ ...u, password: hash });
            console.log(`Usuario ${u.usuario} insertado`);
        } else {
            console.log(`Usuario ${u.usuario} ya existe, no se insertó`);
        }
    }
}

async function main() {
    try {
        await connectDB();
        await resetUsuarios();     // <-- elimina todos los registros primero
        await insertarUsuarios();  // <-- vuelve a insertar la lista fija
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await disconnectDB();
    }
}

main();
