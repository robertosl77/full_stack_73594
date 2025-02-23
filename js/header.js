document.addEventListener("DOMContentLoaded", function () {
    const header = document.createElement("header");
    header.innerHTML = `
        <nav>
            <a href="index.html"><img class="logo" src="img/logo.png" alt="Logo"></a>
            <button class="menu-toggle" aria-label="Abrir menú">☰</button>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="contacto.html">Contacto</a></li>
                <li><a href="nosotros.html">Nosotros</a></li>
                <li id="admin-link" style="display: none;"><a href="alta.html">Alta de Productos</a></li>
                <li><a href="#" id="login-button">Iniciar sesión</a></li>
            </ul>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const loginButton = document.getElementById("login-button");
    const adminLink = document.getElementById("admin-link");

    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("nav-menu-visible");
    });

    function iniciarSesion() {
        const usuario = prompt("Ingrese su usuario:");
        const contrasena = prompt("Ingrese su contraseña:");

        sessionStorage.setItem("usuario", usuario.charAt(0).toUpperCase() + usuario.slice(1).toLowerCase());

        if (usuario.toLowerCase() === "usuario" && contrasena.toLowerCase() === "123") {
            sessionStorage.setItem("rol", "ROLE_CONSULTA");
            actualizarEstadoSesion();
        } else if (usuario.toLowerCase() === "admin" && contrasena.toLowerCase() === "12345") {
            sessionStorage.setItem("rol", "ROLE_ADMINISTRADOR");
            console.log(usuario);
            console.log(sessionStorage.getItem("usuario"));
            actualizarEstadoSesion();
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    }

    function cerrarSesion() {
        sessionStorage.removeItem("rol");
        loginButton.innerText = "Iniciar sesión";
        adminLink.style.display = "none";
    }

    function actualizarEstadoSesion() {
        loginButton.innerText = sessionStorage.getItem("usuario");
        if (sessionStorage.getItem("rol") === "ROLE_ADMINISTRADOR") {
            adminLink.style.display = "block";
        } else {
            adminLink.style.display = "none";
        }
    }

    loginButton.addEventListener("click", function () {
        if (sessionStorage.getItem("rol")) {
            cerrarSesion();
        } else {
            iniciarSesion();
        }
    });

    const rolGuardado = sessionStorage.getItem("rol");
    if (rolGuardado === "admin") {
        adminLink.style.display = "block";
    }
    if (rolGuardado) {
        actualizarEstadoSesion(rolGuardado);
    }

    // Redirección si un usuario estándar intenta acceder a alta.html
    if (window.location.pathname.includes("alta.html") && sessionStorage.getItem("rol") !== "ROLE_ADMINISTRADOR") {
        window.location.href = "index.html";
    }
});
