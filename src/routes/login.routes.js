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

export default router;
