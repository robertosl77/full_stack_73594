import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String },
    apellido: { type: String },
    email: { type: String },
    rol: { type: String, enum: ['ROLE_ADMINISTRADOR', 'ROLE_CLIENTE', 'ROLE_CONSULTA'], default: 'ROLE_CLIENTE' }
});

// 👇 importante: tercer parámetro para que respete tu colección 'usuarios'
export default mongoose.model('Usuario', usuarioSchema, 'usuarios');
