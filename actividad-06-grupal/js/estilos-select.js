window.addEventListener("load", () => {
    const contenedor = document.getElementById("botonesAqui");

    // Crear el <select>
    const selector = document.createElement("select");
    selector.id = "selectorEstilo";
    selector.className = "btn";
    selector.style.height = "40px";

    // Opciones
    const opciones = [{ texto: "Sin estilo", valor: "" }]
    .concat(estilos.map(id => {
        const nombre = id.replace("estilo-", "").replace(/-/g, " ");
        const texto = "Estilo " + nombre.charAt(0).toUpperCase() + nombre.slice(1);
        return { texto, valor: id };
    }));

    opciones.forEach(op => {
        const opt = document.createElement("option");
        opt.value = op.valor;
        opt.textContent = op.texto;
        selector.appendChild(opt);
    });

    contenedor.appendChild(selector);

    // Restaurar estilo guardado (si existe y está activado "Recordar")
    const estiloGuardado = localStorage.getItem("estilo-recordado");
    const btnRecordar = document.getElementById("recordarEstilo");
    if (estiloGuardado && estilos.includes(estiloGuardado) && btnRecordar?.classList.contains("activo")) {
        estilos.forEach(id => document.getElementById(id).disabled = true);
        document.getElementById(estiloGuardado).disabled = false;
        indice = estilos.indexOf(estiloGuardado);
        selector.value = estiloGuardado;
    }

    // Al cambiar el selector
    selector.addEventListener("change", () => {
        estilos.forEach(id => document.getElementById(id).disabled = true);
        if (selector.value !== "") {
            document.getElementById(selector.value).disabled = false;
            indice = estilos.indexOf(selector.value);
        }

        // Si está activo "Recordar", guardar o eliminar
        if (btnRecordar?.classList.contains("activo")) {
            if (selector.value !== "") {
                localStorage.setItem("estilo-recordado", selector.value);
            } else {
                localStorage.removeItem("estilo-recordado");
            }
        }
    });
});
