document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-contacto");
    const inputs = form.querySelectorAll("input, textarea");

    // Validación en tiempo real al perder el foco (blur)
    inputs.forEach(input => {
        input.addEventListener("blur", function () {
            if (input.value.trim() !== "") { // Solo valida si el usuario escribió algo
                validarCampo(input.name);
            }
        });

        // Limpia errores en tiempo real si el usuario modifica el campo
        input.addEventListener("input", function () {
            limpiarErroresCampo(input.name);
            if (input.value.trim() === "") {
                // Si el usuario borró el contenido, elimina el error previo
                limpiarErroresCampo(input.name);
            }
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        mostrarMensajeExito(form);
    });
});

function validarFormulario() {
    const nombre = obtenerValor("nombre");
    const email = obtenerValor("email");
    const comentarios = obtenerValor("comentarios");

    limpiarErrores();

    let errores = [];

    if (!validarNombre(nombre)) errores.push({ campo: "nombre", mensaje: "El nombre debe contener al menos 5 caracteres." });
    if (!validarEmail(email)) errores.push({ campo: "email", mensaje: "Ingrese un email válido." });
    if (!validarComentarios(comentarios)) errores.push({ campo: "comentarios", mensaje: "Debe ingresar un comentario." });

    if (errores.length > 0) {
        mostrarErrores(errores);
        return false;
    }
    return true;
}

// Nueva función para validar un solo campo en tiempo real
function validarCampo(nombreCampo) {
    const valor = obtenerValor(nombreCampo);
    let errores = [];

    if (nombreCampo === "nombre" && !validarNombre(valor)) errores.push({ campo: nombreCampo, mensaje: "El nombre debe contener al menos 5 caracteres." });
    if (nombreCampo === "email" && !validarEmail(valor)) errores.push({ campo: nombreCampo, mensaje: "Ingrese un email válido." });
    if (nombreCampo === "comentarios" && !validarComentarios(valor)) errores.push({ campo: nombreCampo, mensaje: "Debe ingresar un comentario." });

    limpiarErroresCampo(nombreCampo);
    if (errores.length > 0) mostrarErrores(errores);
}

// Obtiene el valor de un campo y lo recorta
function obtenerValor(nombreCampo) {
    const campo = document.querySelector(`input[name='${nombreCampo}']`) || document.querySelector(`textarea[name='${nombreCampo}']`);
    return campo ? campo.value.trim() : "";
}

// Valida el nombre
function validarNombre(nombre) {
    return nombre.length >= 5;
}

// Valida el email con expresión regular
function validarEmail(email) {
    const emailRegex = /^(?!\.)([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Verifica que los comentarios no estén vacíos
function validarComentarios(comentarios) {
    return comentarios.length > 0;
}

// Muestra los errores debajo de los campos
function mostrarErrores(errores) {
    errores.forEach(error => {
        const campo = document.querySelector(`input[name='${error.campo}'], textarea[name='${error.campo}']`);
        const mensajeError = document.createElement("p");
        mensajeError.className = "mensaje-error";
        mensajeError.textContent = error.mensaje;
        campo.parentElement.appendChild(mensajeError);
    });
}

// Limpia los errores de un campo específico al corregirlo
function limpiarErroresCampo(nombreCampo) {
    document.querySelectorAll(`input[name='${nombreCampo}'] ~ .mensaje-error, textarea[name='${nombreCampo}'] ~ .mensaje-error`).forEach(mensaje => mensaje.remove());
}

// Limpia todos los errores previos antes de mostrar nuevos
function limpiarErrores() {
    document.querySelectorAll(".mensaje-error").forEach(mensaje => mensaje.remove());
}

// Muestra mensaje de éxito y limpia el formulario
function mostrarMensajeExito(form) {
    limpiarErrores();
    const mensajeExito = document.createElement("p");
    mensajeExito.className = "mensaje-exito";
    mensajeExito.textContent = "Formulario enviado con éxito.";
    form.appendChild(mensajeExito);
    form.reset();
}
