
// importamos express
const express = require('express');

// importamos el uuid para generar un id unico
const { v4: uuidv4 } = require('uuid');

// si no se muestra el public, importamos el path
const path = require('path');

// importo el modelo de persona
const Persona = require('./personaModel'); // 

// importamos mongoose para conectarnos a la base de datos
const mongoose = require('mongoose');

// conectamos a la base de datos local
mongoose.connect('mongodb://localhost:27017/pruebaajax')
  .then(() => console.log('Connectado a la base de datos: pruebaajax'))
  .catch(err => console.error('Connection error', err));

// ejecutamos express
// y guardamos la referencia en una variable
const server = express();

let contador = 0;
// creamos nuestro middleware: es una función entre la peticion y la respuesta
// que tiene tres parametros: req, res y next

const pruebaMidd = (peticion, respuesta, next) => {

    contador++;
    console.log(`Pasó por nuesto Middleware, sos el usuario número: ${contador}`);

    //respuesta.send(`Pasó por nuesto Middleware, sos el usuario número: ${contador}`);

    // si no llamamos a next, el servidor no va a responder
    // y se va a quedar esperando la respuesta
    next();

}

// usamos el middleware
server.use(pruebaMidd);

// usamos el middleware para parsear el body de la peticion
server.use(express.json()); // para parsear el body de la peticion

console.log(__dirname);
console.log(path.join(__dirname, 'public'));



// usamos un middleware para ver el frontend
server.use(express.static('public')); // 1
//server.use(express.static(path.join(__dirname, 'public'))); // 2

// creamos el puerto
const PORT = 3000;


// creamos nuestra primer ruta del POST
server.post('/recibir', (req, res)=>{

    const { nombre, apellido } = req.body; // destructuramos el body de la peticion

    //const nombre = req.body.nombre;
    //const apellido = req.body.apellido;

    //console.log(req);

/*     const persona = { 
        nombre: req.body.nombre, 
        apellido: req.body.apellido, 
    } */

    //console.log(persona);

    console.log("========================");

    const OtraPersona = { 
        nombre, 
        apellido,
        //id: uuidv4(), // generamos un id unico para cada persona
    }

    console.log(OtraPersona);
    
    console.log("========================");
    
    // imprimimos la peticion en consola    
    console.log(req.body);

    // guardamos la persona en la base de datos
    const persona = new Persona(OtraPersona); // creamos una nueva persona con el modelo

    persona.save() // guardamos la persona en la base de datos

    // enviamos la respuesta al cliente
    res.send(`Hola ${nombre} ${apellido}, tu mensaje fue recibido correctamente`);	    
});

// creamos una ruta para el GET de personas
server.get('/api/personas', async (req, res) => {
    // buscamos todas las personas en la base de datos
    try {
        const personas = await Persona.find({});

        // imprimimos la lista de personas en consola
        console.log(personas);
        
        // enviamos la lista de personas al cliente
        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las personas');
    }
});


// creamos un middleware para el 404 = 1
// Middleware 404 al final de todas tus rutas
server.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.url}`);
    res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

// Middleware para manejar errores 500
server.use((err, req, res, next) => {
    console.error(err.stack); // Imprime el error en la consola
    res.status(500).send('<h1>500 - Error interno del servidor</h1>');
});


// creamos una ruta para específica para el 404
// Manejo de errores 404 (ruta no encontrada)
/* server.get('*', (req, res) => {
    console.log(`Ruta no encontrada: ${req.url}`);

    res.status(404).send('<h1>404 - Página no encontrada</h1>');
});  */

// levantamos el servidor en el puerto 3000
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});