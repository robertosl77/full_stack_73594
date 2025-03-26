const estilos = [
    "estilo-base",
    "estilo-retro",
    "estilo-futuro",
    "estilo-propio1",
    "estilo-propio2"
];

let indice = 0;

window.addEventListener("load", () => {
    const btn = document.createElement("button");
    btn.id = "cambiarEstilo";
    btn.textContent = "Cambiar Estilo";
    btn.style.zIndex = "9999";
    btn.className="btn";
    
    document.getElementById("botonesAqui").appendChild(btn);

    btn.addEventListener("click", () => {
        // Desactivar todos
        estilos.forEach(id => {
            document.getElementById(id).disabled = true;
        });

        // Activar el siguiente
        indice = (indice + 1) % estilos.length;
        // console.log("indice: "+indice);
        document.getElementById(estilos[indice]).disabled = false;
    });
});
