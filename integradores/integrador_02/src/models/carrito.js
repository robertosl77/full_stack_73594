import mongoose from 'mongoose';

const productoEnCarritoSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  estado: { type: Number, enum: [0, 1, 2], default: 1 }, // 0: eliminado, 1: activo, 2: guardado
  fecha_agregado: { type: Date, default: Date.now },
  fecha_eliminado: { type: Date, default: null }
});

const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
  productos: [productoEnCarritoSchema]
});

export default mongoose.model('Carrito', carritoSchema);
