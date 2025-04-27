import db from '../config/db.js';

const contactoCollection = db.db().collection('contactos');

export default contactoCollection;
