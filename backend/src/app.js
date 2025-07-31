import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';

import loginRoutes from './routes/login.routes.js';
import productosRoutes from './routes/productos.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import contactoRoutes from './routes/contacto.routes.js';
import mensajesRoutes from './routes/mensajes.routes.js';
import abmRoutes from './routes/abm.routes.js';
import altaRoutes from './routes/alta.routes.js';

dotenv.config();

const app = express();
const BASEDIR = process.env.BASEDIR;

// 🌐 CORS dinámico
const allowedOrigins = process.env.ORIGENES_PERMITIDOS?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No autorizado por CORS: ' + origin));
    }
  },
  credentials: true
}));

// Middleware de Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: false
  }
}));

app.use((req, res, next) => {
  res.locals.basedir = BASEDIR;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Redirecciones base
app.get('/', (req, res) => res.redirect(`${BASEDIR}/login`));
app.get(BASEDIR, (req, res) => res.redirect(`${BASEDIR}/login`));

// Rutas
app.use(BASEDIR, loginRoutes);
app.use(BASEDIR, productosRoutes);
app.use(BASEDIR, carritoRoutes);
app.use(BASEDIR, contactoRoutes);
app.use(BASEDIR, mensajesRoutes);
app.use(BASEDIR, abmRoutes);
app.use(BASEDIR, altaRoutes);

// Mongo
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.info('MongoDB conectado'))
  .catch(err => console.error(err));

// Archivos estáticos
app.use(BASEDIR, express.static('public'));

export default app;
