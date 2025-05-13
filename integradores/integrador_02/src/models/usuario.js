import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    usuario: String,
    password: String,
    nombre: String,
    apellido: String,
    email: String
});

export default mongoose.model('Usuario', usuarioSchema, 'usuarios');
