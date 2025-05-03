
// Trabajamos con ES5 ==> JS nativo

const http = require('http');//10..
const pepe = require('node:http');//20..

// Creamos un servidor
const server = http.createServer((peticion, respuesta) => {

    console.log("=============================================");
    
    console.log(peticion);

    console.log("=============================================");

    console.log("URL: ", peticion.url); // URL de la petición
    console.log("METHOD: ", peticion.method); // Método de la petición
    console.log("HEADERS: ", peticion.headers); // Headers de la petición
    console.log("BODY: ", peticion.body); // Body de la petición
    
    console.log("=============================================");

    let ruta = peticion.url; // Ruta de la petición

    // Creamos unas rutas para el usuario
    switch (ruta) {
        case '/':
            console.log("Ruta raíz");
            respuesta.end('Estas recibiendo página HOME'); // Respuesta al cliente
            break;
        case '/formulario':
            console.log("Ruta formulario");
            respuesta.end(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de Registro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <main class="container mt-5">
        <h2 class="mb-4">Registro de Usuario</h2>
        <form id="registroForm" action="js" method="post">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control w-75" id="nombre" name="nombre" placeholder="Ingrese su nombre" required>
            </div>
            <div class="mb-3">
                <label for="apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control" id="apellido" placeholder="Ingrese su apellido" required>
            </div>
            <div class="mb-3">
                <label for="edad" class="form-label">Edad</label>
                <input type="number" class="form-control" id="edad" placeholder="Ingrese su edad" required>
            </div>
            <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="direccion" placeholder="Ingrese su dirección" required>
            </div>
            <div class="mb-3">
                <label for="provincia" class="form-label">Provincia</label>
                <select class="form-select" id="provincia" required>
                    <option value="" selected disabled>Seleccione la provincia</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Mendoza">Mendoza</option>
                    <option value="Santa Fe">Santa Fe</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Género</label><br>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="genero" id="generoMasculino" value="Masculino"
                        required>
                    <label class="form-check-label" for="generoMasculino">Masculino</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="genero" id="generoFemenino" value="Femenino"
                        required>
                    <label class="form-check-label" for="generoFemenino">Femenino</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="genero" id="generoOtro" value="Otro" required>
                    <label class="form-check-label" for="generoOtro">Otro</label>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Hobbies</label><br>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="hobbyDeporte" value="Deporte">
                    <label class="form-check-label" for="hobbyDeporte">Deporte</label>
                </div>
                <div class="fm-check">
                    <input class="form-check-input" type="checkbox" id="hobbyMusica" value="Música">
                    <label class="form-check-label" for="hobbyMusica">Música</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="hobbyArte" value="Arte">
                    <label class="form-check-label" for="hobbyArte">Arte</label>
                </div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" placeholder="Ingrese su contraseña" required>
            </div>
            <button type="submit" class="btn btn-primary">Registrarse</button>
            <button type="reset" onclick='()=>{alert("todo joya");} class="btn btn-danger">Eliminar Datos</button>
        </form>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./registro.js"></script>
</body>

</html>`); // Respuesta al cliente
            break;
        default:
            break;
    }

    console.info("todo joya");

}); 

// Puerto del servidor
const PORT = 8080; // back

// 3000 react
// 3306 mysql
// 4200 angular
// 9000 apache java
// 27017 mongodb
// 5432 postgresql

// Activamos el servidor para que escuche las peticiones
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});


