
//importamos la configuración de dotenv
require('dotenv').config(); // importamos la configuración de dotenv

// también puede ser
const dotenv = require('dotenv'); // importamos la configuración de dotenv
dotenv.config(); // configuramos dotenv

// Importamos el servidor
const app = require('./app'); // importamos el servidor

// Importamos el puerto
const PORT = process.env.PORT || 3000; // importamos el puerto de la configuración de dotenv o el puerto 3000 por defecto


// Conexión a la base de datos






// levantamos el servidor
app.listen(PORT, () => { // levantamos el servidor
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`); // mostramos un mensaje en la consola
}); // levantamos el servidor