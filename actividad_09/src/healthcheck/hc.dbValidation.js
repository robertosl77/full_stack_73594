import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/db-validation', async (req, res) => {
  try {
    const collections = await db.db().listCollections({ name: 'contactos' }).toArray();
    const validation = collections.length > 0 ? collections[0].options.validator : null;

    res.json({ validator: validation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
