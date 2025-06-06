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
import carritoRoutes from './routes/carrito.routes.js';
import registerHandlebarsHelpers from './helpers/handlebarsHelpers.js';
import { auth } from 'express-openid-connect';

dotenv.config();

const app = express();
const BASEDIR = process.env.BASEDIR;

// Configuracion de Aut0
const configAuth0 = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    routes: {
        login: `/${BASEDIR}/auth0/login`,
        logout: `/${BASEDIR}/auth0/logout`,
        callback: `/${BASEDIR}/auth0/callback`
    },
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email',
        prompt: "login"
    }
};

// Middleware de Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Middleware Auth0
app.use(auth(configAuth0));

// Middleware para pasar basedir a todas las vistas
app.use((req, res, next) => {
    res.locals.basedir = BASEDIR;
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.use(BASEDIR, carritoRoutes);

// Conexion mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.info('MongoDB conectado'))
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


app.get(`${BASEDIR}/auth0`, (req, res) => {
    res.send(req.oidc.isAuthenticated()
      ? `Logueado como ${req.oidc.user.name}`
      : 'No estás logueado con Auth0');
});

export default app;
