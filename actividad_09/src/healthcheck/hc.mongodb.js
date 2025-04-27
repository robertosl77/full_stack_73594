import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/db-health', async (req, res) => {
    try {
      const admin = db.db().admin();
      const ping = await admin.ping();
      const serverStatus = await admin.serverStatus();
  
      res.json({
        status: 'ok',
        ping,
        database: db.db().databaseName,
        serverTime: serverStatus.localTime
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  });
  

export default router;