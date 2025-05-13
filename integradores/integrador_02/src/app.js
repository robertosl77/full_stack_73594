import express from 'express';
import Handlebars from 'handlebars';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Usuario from './models/usuario.js';
import Producto from './models/producto.js';
import { obtenerProductosConDescuento } from './services/productoService.js';

dotenv.config();

const app = express();
const BASEDIR = process.env.BASEDIR;

app.use(express.urlencoded({ extended: true }));

// Conexion mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './src/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
});



// Registrar helper json
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

// --------------------------------------------------
// FLUJO inicial a login
// --------------------------------------------------

app.get('/', (req, res) => res.redirect(`${BASEDIR}/login`));
app.get(BASEDIR, (req, res) => res.redirect(`${BASEDIR}/login`));

// Login
app.get(`${BASEDIR}/login`, (req, res) => {
    res.render('login', { basedir: BASEDIR });
});

app.post(`${BASEDIR}/login`, async (req, res) => {
    const { usuario, password } = req.body;
    const user = await Usuario.findOne({ usuario });

    if (user && await bcrypt.compare(password, user.password)) {
        res.redirect(`${BASEDIR}/productos`);
    } else {
        res.render('login', { basedir: BASEDIR, error: 'Usuario o contraseña incorrectos' });
    }
});

// 👉 Productos (mostrar cards con mongoose)
app.get(`${BASEDIR}/productos`, async (req, res) => {
    try {
        const productos = await obtenerProductosConDescuento();
        res.render('productos', { productos });
    } catch (error) {
        console.error(error);
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
