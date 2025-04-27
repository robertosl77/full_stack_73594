// Script de configuración inicial, y por unica vez, de la base de datos
// Ejecutar manualmente desde la terminal con:
// node src\mongodb\validations\contacto.validaciones.js
// Solo debe ejecutarse una vez para crear la colección 'contactos' con validaciones.
// Luego, la colección ya queda disponible y MongoDB gestiona su estructura.

import db from './db.js';

async function setup() {
  await db.connect();
  
  try {
    await db.db().createCollection('contactos', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['nombre', 'email', 'fechaNacimiento'],
          properties: {
            nombre: { bsonType: 'string' },
            email: { bsonType: 'string' },
            fechaNacimiento: { bsonType: 'date' }
          }
        }
      }
    });
    console.info('Colección contactos creada con validación.');
  } catch (error) {
    console.error('Error creando la colección:', error.message);
  } finally {
    await db.close();
  }
}

setup();
