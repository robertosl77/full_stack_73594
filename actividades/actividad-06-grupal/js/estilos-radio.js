window.addEventListener("load", () => {
    const contenedor = document.getElementById("botonesAqui");

    const grupoRadios = document.createElement("div");
    grupoRadios.id = "grupo-estilos-radio";
    grupoRadios.style.display = "flex";
    grupoRadios.style.flexDirection = "row";
    grupoRadios.style.alignItems = "center";
    grupoRadios.style.gap = "10px";

    const radios = [{ texto: "Sin estilo", valor: "" }]
        .concat(estilos.map(id => {
            const nombre = id.replace("estilo-", "").replace(/-/g, " ");
            const texto = "Estilo " + nombre.charAt(0).toUpperCase() + nombre.slice(1);
            return { texto, valor: id };
        }));

    radios.forEach(op => {
        const label = document.createElement("label");
        // label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.gap = "4px";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "estiloElegido";
        radio.value = op.valor;

        label.appendChild(radio);
        label.appendChild(document.createTextNode(op.texto));
        grupoRadios.appendChild(label);

        radio.addEventListener("change", () => {
            estilos.forEach(id => document.getElementById(id).disabled = true);
            if (radio.value !== "") {
                document.getElementById(radio.value).disabled = false;
                indice = estilos.indexOf(radio.value);
            }

            const btnRecordar = document.getElementById("recordarEstilo");
            if (btnRecordar?.classList.contains("activo")) {
                if (radio.value !== "") {
                    localStorage.setItem("estilo-recordado", radio.value);
                } else {
                    localStorage.removeItem("estilo-recordado");
                }
            }
        });
    });

    contenedor.appendChild(grupoRadios);

    // Restaurar si estaba recordado
    const estiloGuardado = localStorage.getItem("estilo-recordado");
    const btnRecordar = document.getElementById("recordarEstilo");
    if (estiloGuardado && btnRecordar?.classList.contains("activo")) {
        estilos.forEach(id => document.getElementById(id).disabled = true);
        if (estiloGuardado !== "") {
            document.getElementById(estiloGuardado).disabled = false;
            indice = estilos.indexOf(estiloGuardado);
        }
        const radio = grupoRadios.querySelector(`input[value="${estiloGuardado}"]`);
        if (radio) radio.checked = true;
    }
});
