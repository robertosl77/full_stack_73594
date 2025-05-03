window.addEventListener("load", () => {
    const form = document.getElementById("form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const datos = JSON.parse(sessionStorage.getItem("usuarios")) || [];

        // Validamos datos del Form
        if (!form.condiciones.checked) {
            alert("Debe aceptar las condiciones para avanzar!");
            return;
        }

        // Creamos un objeto con los datos del formulario
        const nuevo = {
            id: datos.length > 0 ? datos[datos.length - 1].id + 1 : 1,
            nombre: form.nombre.value,
            apellido: form.apellido.value,
            dni: parseInt(form.dni.value),
            nacionalidad: form.seleccionar.value,
            sobre: form.about.value,
            sexo: form.opciones.value,
            telefono: form.telefono.value,
            mail: form.mail.value,
            actividades: Array.from(document.querySelectorAll(".checkboxSedes input:checked")).map(i => i.value),
            condiciones: form.condiciones.checked,
            novedades: form.novedades.checked
        };

        datos.push(nuevo);
        sessionStorage.setItem("usuarios", JSON.stringify(datos));

        console.log(datos);
        form.reset();
    });
});
