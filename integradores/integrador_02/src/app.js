import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Usuario from './models/usuario.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const BASEDIR = process.env.BASEDIR;

app.use(express.urlencoded({ extended: true }));

// Conexion mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

const productoSchema = new mongoose.Schema({
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

const Producto = mongoose.model('Producto', productoSchema, 'productos');

// Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './src/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

// --------------------------------------------------
// FLUJO inicial a login
// --------------------------------------------------

// Si entro a raíz o BASEDIR → redirige a login
app.get('/', (req, res) => res.redirect(`${BASEDIR}/login`));
app.get(BASEDIR, (req, res) => res.redirect(`${BASEDIR}/login`));

// Login
app.get(`${BASEDIR}/login`, (req, res) => {
    res.render('login');
});

// Validar login
app.post(`${BASEDIR}/login`, async (req, res) => {
    const { usuario, password } = req.body;
    const user = await Usuario.findOne({ usuario });

    if (user && await bcrypt.compare(password, user.password)) {
        res.redirect(`${BASEDIR}/productos`);
    } else {
        res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
});

// Productos
app.get(`${BASEDIR}/productos`, async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('index', { productos });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});

// Otros
app.use(express.static('public'));

app.post(`${BASEDIR}/info`, (req, res) => {
    const { nombre, edad } = req.body;
    res.render('info', { nombre, edad });
});

export default app;
