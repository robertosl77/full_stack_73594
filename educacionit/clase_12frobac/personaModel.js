
// Importamos el paquete mongoose
const mongoose = require('mongoose');

// Creamos un esquema para la colección de personas
const personaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    }
});

// exportamos el modelo de la colección de personas
const Persona = mongoose.model('Persona', personaSchema);

module.exports = Persona; // exportamos el modelo para usarlo en otros archivos