// src/routes/productos.routes.js
import express from 'express';

const router = express.Router();

router.get('/nosotros', (req, res) => {
    res.render('nosotros', { user: req.session.user, extraCss: '/css/nosotros.css' });
});

export default router;
