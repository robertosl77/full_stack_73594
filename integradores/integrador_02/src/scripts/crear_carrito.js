import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
    cantidad: { type: Number, required: true },
    estado: { type: Number, enum: [0, 1, 2], default: 1 },
    fecha_agregado: { type: Date, default: Date.now },
    fecha_eliminado: { type: Date }
  }]
});

const Carrito = mongoose.model('Carrito', carritoSchema);

const crearCarrito = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const nuevoCarrito = new Carrito({
    usuario: '6823f7ce9e1e4620df4d7137',
    productos: [{
      producto: '6822a9d102050feacbb2ee98',
      cantidad: 1,
      estado: 1,
      fecha_agregado: new Date(), // Se asigna la fecha actual por defecto
      fecha_eliminado: null // Inicialmente no hay fecha de eliminación
    }],
  });

  await nuevoCarrito.save();
  console.log('Carrito creado correctamente');
  await mongoose.disconnect();
};

crearCarrito().catch(console.error);
