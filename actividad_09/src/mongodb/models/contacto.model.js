import db from '../db.js';

const contactoCollection = db.db().collection('contactos');

export default contactoCollection;
