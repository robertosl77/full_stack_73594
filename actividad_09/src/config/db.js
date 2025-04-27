import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const db = new MongoClient(process.env.MONGODB_URI);

export default db;