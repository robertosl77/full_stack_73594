//trabajamos con ES5 => JS Nativo

const http = require('http'); //vers 10..
//const http = require('node:http'); //vers 20..

//creamos servidor (req, res)
const server = http.createServer((peticion, respuesta) => {

    console.log("==========================");
    console.log(peticion);
    console.log("==========================");
    console.log("URL: ", peticion.url);
    console.log("METHOD: ", peticion.method);
    console.log("HEADERS: ", peticion.headers);
    console.log("BODY: ", peticion.body);
    console.log("==========================");

let ruta = peticion.url; //ruta de la peticion

// Creamos unas rutas para el usuario

switch (ruta) {
    case '/':
        console.log("Peticion a la ruta raiz");
        respuesta.end('Hola Mundo desde la ruta raiz!');
        break;
    case '/formulario':
        console.log("Peticion a la ruta formulario");
        respuesta.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Formulario</title>
            </head>
            <body>
            <h1>Formulario</h1>
            <form action="/submit" method="POST">
                <label for="name">Nombre:</label>
                <input type="text" id="name" name="name" required>
                <br><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <br><br>
                <button type="submit">Enviar</button>
            </form>
            </body>
            </html>
        `);
        break;


    default:
        respuesta.end('Hola Mundo');
        break;
}

    console.info("corriendo servidor...");

});

//Puerto del servidor
const PORT = 8080;

//Escuchamos el puerto > Activamos el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});