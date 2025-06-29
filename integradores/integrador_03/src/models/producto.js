// src/models/producto.js
import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    id: Number,
    imagen: String,
    categoria: String,
    bodega: String,
    tipo: String,
    nombre: String,
    precio_original: Number,
    descuento: Number,
    stock: Number,
    estado: Boolean
});

export default mongoose.model('Producto', productoSchema, 'productos');
