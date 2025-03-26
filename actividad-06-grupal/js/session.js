window.addEventListener("load", () => {
    if (!sessionStorage.getItem("usuarios")) {
        const datos = obtenerDatos();
        sessionStorage.setItem("usuarios", JSON.stringify(datos));
    }

    console.log(JSON.parse(sessionStorage.getItem("usuarios")));
});
