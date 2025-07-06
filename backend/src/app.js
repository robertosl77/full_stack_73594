import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import loginRoutes from './routes/login.routes.js';
import productosRoutes from './routes/productos.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
// import nosotrosRoutes from './routes/nosotros.routes.js'
// import contactoRoutes from './routes/contacto.routes.js';
// import mensajesRoutes from './routes/mensajes.routes.js';
// import abmRoutes from './routes/abm.routes.js';
// import altaRoutes from './routes/alta.routes.js';
import cors from "cors";

dotenv.config();

const app = express();
const BASEDIR = process.env.BASEDIR;

// Habilitar CORS para permitir llamadas desde React (localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Middleware de Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax', // Necesario para permitir frontend/backend en distintos puertos
    secure: false     // true solo si usás HTTPS
  }
}));

// Middleware para pasar basedir a todas las vistas
app.use((req, res, next) => {
    res.locals.basedir = BASEDIR;
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Redirecciones base
app.get('/', (req, res) => res.redirect(`${BASEDIR}/login`));
// app.get(BASEDIR, (req, res) => res.redirect(`${BASEDIR}/login`));
app.get(BASEDIR, (req, res) => res.redirect(`${BASEDIR}/login`));

// Routes
app.use(BASEDIR, loginRoutes);
app.use(BASEDIR, productosRoutes);
app.use(BASEDIR, carritoRoutes);
// app.use(BASEDIR, nosotrosRoutes);
// app.use(BASEDIR, contactoRoutes);
// app.use(BASEDIR, mensajesRoutes);
// app.use(BASEDIR, abmRoutes);
// app.use(BASEDIR, altaRoutes);

// Conexion mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.info('MongoDB conectado'))
  .catch(err => console.error(err));

// Otros
app.use(express.static('public'));
// app.use(BASEDIR, express.static('public'));




export default app;
