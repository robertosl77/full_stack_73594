// La variable estilos viene de estilos-ciclo.js

window.addEventListener("load", () => {
    const btn = document.createElement("button");
    btn.id = "cambiarRandom";
    btn.textContent = "Cambiar Random";
    btn.style.zIndex = "9999";
    btn.className="btn";
    
    document.getElementById("botonesAqui").appendChild(btn);

    btn.addEventListener("click", () => {
        // Desactivar todos
        estilos.forEach(id => {
            document.getElementById(id).disabled = true;
        });

        // Activar el siguiente
        let random = Math.floor(Math.random() * estilos.length);
        indice=random; //Se actualiza indice con el valor aleatorio para que el botón cíclico continúe desde ahí y no arranque de cero.
        // console.log("aleatorio: "+random);
        document.getElementById(estilos[random]).disabled = false;
    });
});
