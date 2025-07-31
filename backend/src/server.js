import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Convertir la lista de orígenes permitidos en array
const allowedOrigins = process.env.ORIGENES_PERMITIDOS?.split(',') || [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No autorizado por CORS: ' + origin));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
