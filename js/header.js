document.addEventListener("DOMContentLoaded", function () {
    const header = document.createElement("header");
    header.innerHTML = `
        <nav>
            <a href="index.html"><img class="logo" src="img/logo.png" alt="Logo"></a>
            <ul>
                <li><a href="index.html">Inicio</a></li>
                <li><a href="alta.html">Alta de Productos</a></li>
                <li><a href="contacto.html">Contacto</a></li>
                <li><a href="nosotros.html">Nosotros</a></li>
                <li><a href="#" id="login-button">Iniciar sesión</a></li>
            </ul>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    // Simulación de cambio en el botón al iniciar sesión
    document.getElementById("login-button").addEventListener("click", function () {
        this.innerText = "Usuario: Nombre"; // En el futuro esto cambiará con autenticación real
    });
});
