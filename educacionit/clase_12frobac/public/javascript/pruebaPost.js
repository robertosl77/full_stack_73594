
// Variabales 



// Método para enviar datos al servidor usando XMLHttpRequest
document.getElementById("btnEnviar").addEventListener("click", function (e) {
    
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario

    // Capturar los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;

    const formulario = document.getElementById("formulario");

    // Validar que los campos no estén vacíos
    if (nombre === "" || apellido === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Enviar los datos al servidor en formato JSON
    const datos = {
        nombre: nombre,
        apellido: apellido
    };


    // Crear una instancia de XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Configurar la solicitud
    xhr.open("POST", "http://localhost:3000/recibir", true); // Asegúrate de usar la ruta correcta en tu servidor
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Manejar la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("Respuesta del servidor:", xhr.responseText);
        } else {
            console.error("Error en la solicitud:", xhr.status, xhr.statusText);
        }
    };

    xhr.send(JSON.stringify(datos));

    // Limpiar el formulario después de enviar
    formulario.reset();
});

// Método para recibir datos del servidor usando Ajax
document.getElementById("obtenerPersonas").addEventListener("click", function (e) {
    
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario

    // Crear una instancia de XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Configurar la solicitud
    xhr.open("GET", "http://localhost:3000/api/personas", true); // 

    // Manejar la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("Respuesta del servidor:", xhr.responseText);

            let resultado = document.getElementById("resultado");
            resultado.innerHTML = ""; // Limpiar el contenido previo
            resultado.innerText = xhr.responseText; // Mostrar la respuesta en el elemento con id "resultado"
        } else {
            console.error("Error en la solicitud:", xhr.status, xhr.statusText);
        }
    };
    xhr.send();

});