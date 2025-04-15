const express = require('express'); //importamos express

const server = express(); //instanciamos express en la variable server

//const path = require('path'); //importamos el modulo path de node (npm i path)

//creamos nuestro middleware (es una funcion entre la peticion y la respuesta)
/**
 * req: peticion
 * res: respuesta
 * next: 
*/
let contador = 0;
function pruebaMiddleware(req, res, next) {
    contador++;
    console.log("Middleware: sos el usuario #" + contador + "");
    // res.send("Middleware: sos el usuario #" + contador + "");

    next();
}

// Middleware para el 404


//usamos el middleware
server.use(pruebaMiddleware);

//usamos un middleware para visualizar el front
server.use(express.static('public'));
// server.use(express.static(path.join(__dirname,'public')));

// creamos una ruta especifica para el 404
// server.get('/', (req, res) => {
//     // res.status(404).sendFile('public/404.html', { root: __dirname });   
//     // res.status(404).send('404: Ruta no encontrada');
//     //res.send(`<h1>404: Ruta no encontrada</h1>`);
//     res.status(404).send(`<h1>404: Ruta no encontrada</h1>`);
// });

// server.get('*', (req, res) => {
//     res.status(404).send(`<h1>404: Ruta no encontrada</h1>`);
// });

server.use((req, res) => {
    res.status(404).send(`<h1>404: Ruta no encontrada</h1>`);
});

const PORT= 3000; //definimos el puerto del servidor

// Levantamos el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo: http://localhost:${PORT}`);
});


