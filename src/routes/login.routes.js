// src/routes/login.routes.js
import express from 'express';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.js';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { layout: false });
});

router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    const user = await Usuario.findOne({ usuario });
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = {
            _id: user._id,
            usuario: user.usuario,
            rol: user.rol,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email
        };
        res.redirect(`${res.locals.basedir}/productos`);
    } else {
        res.render('login', { layout: false, error: 'Usuario o contraseña incorrectos' });
    }
});

router.get("/logout", (req, res) => {
    console.log("=== LOGOUT SOLICITADO ===")
    console.log("Sesión usuario:", req.session?.user ? "ACTIVA" : "INACTIVA")
    console.log("Auth0 autenticado:", req.oidc?.isAuthenticated() ? "SÍ" : "NO")
  
    // Si hay sesión Auth0 activa, usar logout de Auth0
    if (req.oidc && req.oidc.isAuthenticated()) {
      console.log("🔑 EJECUTANDO LOGOUT AUTH0")
      console.log("Usuario Auth0:", req.oidc.user?.email || req.oidc.user?.sub || "desconocido")
  
      req.session.destroy(() => {
        console.log("✅ Sesión local destruida, redirigiendo a Auth0 logout")
        res.oidc.logout({
          returnTo: `${res.locals.basedir}/login`,
        })
      })
    } else {
      // Solo sesión local
      console.log("🔑 EJECUTANDO LOGOUT LOCAL")
      if (req.session?.user) {
        console.log("Usuario local:", req.session.user.email || req.session.user.usuario || "desconocido")
      }
  
      req.session.destroy(() => {
        console.log("✅ Sesión local destruida, redirigiendo a login")
        res.redirect(`${res.locals.basedir}/login`)
      })
    }
})

// Auth0
router.get('/auth0/login', (req, res) => {
    console.log(res.locals.basedir+'/productos');
    res.oidc.login({
        returnTo: `${res.locals.basedir}/productos`
    });
});

router.get('/auth0/callback', async (req, res, next) => {
    console.log('Entrando en /auth0/callback');
    console.log('Query params:', req.query);
    console.log('oidc:', req.oidc);

    try {
        if (!req.oidc || !req.oidc.isAuthenticated() || !req.oidc.user) {
            console.log('No autenticado o sin datos de usuario, creando usuario invitado');
            const email = 'invitado@demo.com';
            let user = await Usuario.findOne({ email });

            if (!user) {
                user = new Usuario({
                    usuario: 'invitado',
                    nombre: 'Invitado',
                    apellido: 'Demo',
                    email,
                    rol: 'ROLE_VISTA',
                    password: '~~',
                    rrss: {}
                });
                await user.save();
            }

            req.session.user = {
                _id: user._id,
                rol: user.rol,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            };

            return res.redirect(`${res.locals.basedir}/productos`);
        }

        console.log('Usuario autenticado:', req.oidc.user);
        const sub = req.oidc.user.sub;
        if (!sub || typeof sub !== 'string') {
            console.error('Error: sub no es una cadena válida:', sub);
            throw new Error('Formato de sub inválido');
        }

        const [proveedor, idSocial] = sub.split('|');
        const email = req.oidc.user.email || 'sin-email@auth0.com';
        const nombre = req.oidc.user.given_name || req.oidc.user.name || '';
        const apellido = req.oidc.user.family_name || '';

        let user = await Usuario.findOne({ 'rrss.idSocial': idSocial, 'rrss.proveedor': proveedor });

        if (user) {
            if (user.rrss.email !== email) {
                user.rrss.email = email;
                await user.save();
            }
        } else {
            user = await Usuario.findOne({ email });

            if (user) {
                user.rrss = { proveedor, idSocial, email };
                await user.save();
            } else {
                user = new Usuario({
                    usuario: email.split('@')[0],
                    nombre,
                    apellido,
                    email,
                    rol: 'ROLE_CLIENTE',
                    password: '~~',
                    rrss: { proveedor, idSocial, email }
                });
                await user.save();
            }
        }

        req.session.user = {
            _id: user._id,
            rol: user.rol,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.rrss?.email || user.email
        };

        res.redirect(`${res.locals.basedir}/productos`);
    } catch (error) {
        console.error('Error en /auth0/callback:', error);
        next(error);
    }
});



export default router;
