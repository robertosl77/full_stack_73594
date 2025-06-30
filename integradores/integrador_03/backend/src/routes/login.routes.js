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
    console.log('usuario: '+usuario);
    const user = await Usuario.findOne({ usuario });

    console.log('user: '+user);

    if (user && await bcrypt.compare(password, user.password)) {
        console.log('usuario: '+usuario);
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
        console.log('ususario nulo');
        res.render('login', { layout: false, error: 'Usuario o contraseña incorrectos' });
    }
});

router.get("/logout", (req, res) => {
    console.log("=== LOGOUT SOLICITADO ===");
    if (req.session?.user) {
        console.log("Usuario local:", req.session.user.email || req.session.user.usuario || "desconocido");
    }
    req.session.destroy(() => {
        console.log("✅ Sesión local destruida, redirigiendo a login");
        res.redirect(`${res.locals.basedir}/login`);
    });
});


// Login con firebase
router.post('/loginFirebase', async (req, res) => {
    const { proveedor, idSocial, email, nombre, apellido } = req.body;

    try {
        if (!proveedor || !idSocial || !email) {
            throw new Error('Datos incompletos');
        }

        const sessionUser = await procesarLoginSocial({ proveedor, idSocial, email, nombre, apellido });

        req.session.user = sessionUser;
        res.json({ success: true, redirect: `${res.locals.basedir}/productos` });
    } catch (err) {
        console.error('Error en /loginFirebase:', err);
        res.status(500).json({ success: false, error: 'Error al procesar login' });
    }
});


async function procesarLoginSocial({ proveedor, idSocial, email, nombre, apellido }) {
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

    return {
        _id: user._id,
        rol: user.rol,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.rrss?.email || user.email
    };
}

export default router;
