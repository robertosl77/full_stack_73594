import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import loginRoutes from './routes/login.routes.js';
import productosRoutes from './routes/productos.routes.js';
import nosotrosRoutes from './routes/nosotros.routes.js'
import contactoRoutes from './routes/contacto.routes.js';
import mensajesRoutes from './routes/mensajes.routes.js';
import abmRoutes from './routes/abm.routes.js';
import altaRoutes from './routes/alta.routes.js';
import registerHandlebarsHelpers from './helpers/handlebarsHelpers.js';

dotenv.config();

const app = express();
const BASEDIR = process.env.BASEDIR;

// Middleware de Session
app.use(session({
    secret: 'tu_clave_secreta_segura',
    resave: false,
    saveUninitialized: false
}));

// Middleware para pasar basedir a todas las vistas
app.use((req, res, next) => {
    res.locals.basedir = BASEDIR;
    next();
});

app.use(express.urlencoded({ extended: true }));

// Redirecciones base
app.get('/', (req, res) => res.redirect(`${BASEDIR}/login`));
app.get(BASEDIR, (req, res) => res.redirect(`${BASEDIR}/login`));

// Routes
app.use(BASEDIR, loginRoutes);
app.use(BASEDIR, productosRoutes);
app.use(BASEDIR, nosotrosRoutes);
app.use(BASEDIR, contactoRoutes);
app.use(BASEDIR, mensajesRoutes);
app.use(BASEDIR, abmRoutes);
app.use(BASEDIR, altaRoutes);

// Conexion mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './src/views/layouts',
    partialsDir: './src/views/partials',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

// 👉 Registrar helpers externos
registerHandlebarsHelpers();

// Otros
app.use(express.static('public'));
// app.use(BASEDIR, express.static('public'));


app.post(`${BASEDIR}/info`, (req, res) => {
    res.render('info', { nombre, edad });
});

export default app;
