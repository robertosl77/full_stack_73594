// ES5 => js nativo

// crear variables para el uso de librerias
const express = require('express'); //importamos express

// usar una libreria nativa de node: 
const os = require('os'); //importamos el modulo os de node

// creamos una variable para la aplicacion express
const app = express(); //instanciamos express en la variable app



/*
primer parametro: 
    '/' => ruta raiz de la aplicacion o index.html
segundo parametro:
    funcion callback => funcion que se ejecuta cuando se accede a la ruta
    (req, res) => { } => funcion que recibe dos parametros:
        req => objeto que contiene la peticion del cliente
        res => objeto que contiene la respuesta del servidor
*/
app.get('/', function(req, res) {
    console.log('recibimos una peticion a esta ruta');
    res.send('Hola Mundossss'); 
}); 

app.get('/formulario', (req, res) => { //definimos una ruta para la aplicacion
    console.log(`recibimos una peticion a esta ruta ${req.url}`); //imprimimos en consola la ruta que se accede
    res.send(`
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
});



/*
app.post(); //definimos una ruta para la aplicacion
app.put(); //definimos una ruta para la aplicacion  
app.delete(); //definimos una ruta para la aplicacion
app.patch(); //definimos una ruta para la aplicacion
app.all(); //definimos una ruta para la aplicacion
app.use(); //definimos una ruta para la aplicacion
*/


const PORT = 8080; //definimos el puerto de la aplicacion

app.listen(PORT, () => { //iniciamos el servidor en el puerto definido
    console.log(`Servidor escuchando en el puerto ${PORT}`); //mensaje de inicio del servidor
}   ); //fin de la funcion listen