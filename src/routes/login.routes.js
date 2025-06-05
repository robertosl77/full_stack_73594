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

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect(`${res.locals.basedir}/login`);
    });
});

// Auth0
router.get('/auth0/login', (req, res) => {
    res.oidc.login();
});

router.all('/auth0/callback', async (req, res) => {
    console.log('OIDC completo:', req.oidc);
    console.log('¿Está autenticado?', req.oidc.isAuthenticated());
    console.log('Usuario desde oidc:', req.oidc.user);

    if (!req.oidc.isAuthenticated()) {
        // Si no está autenticado, creamos o reutilizamos un usuario invitado
        const email = 'invitado@demo.com';
        let user = await Usuario.findOne({ email });

        if (!user) {
            user = new Usuario({
                usuario: 'invitado', // 👈 este campo es obligatorio
                nombre: 'Invitado',
                apellido: 'Demo',
                email,
                rol: 'ROLE_CONSULTA',
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

    const [proveedor, idSocial] = req.oidc.user.sub.split('|');
    const email = req.oidc.user.email;
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
});




export default router;
