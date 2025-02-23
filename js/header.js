document.addEventListener("DOMContentLoaded", function () {
    const header = document.createElement("header");
    header.innerHTML = `
        <nav>
            <a href="index.html"><img class="logo" src="img/logo.png" alt="Logo"></a>
            <button class="menu-toggle" aria-label="Abrir menú">☰</button>
            <ul class="nav-menu">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="alta.html">Alta de Productos</a></li>
                <li><a href="contacto.html">Contacto</a></li>
                <li><a href="nosotros.html">Nosotros</a></li>
                <li><a href="#" id="login-button">Iniciar sesión</a></li>
            </ul>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("nav-menu-visible");
    });

    document.getElementById("login-button").addEventListener("click", function () {
        this.innerText = "Usuario: Nombre";
    });
});