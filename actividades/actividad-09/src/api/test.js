import express from 'express';

const router = express.Router();

router.get('/mensaje', (req, res) => {
    res.json({ mensaje: 'Hola desde la API de test' });
  });



export default router;