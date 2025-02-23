document.addEventListener("DOMContentLoaded", function () {
    const header = document.createElement("header");
    header.innerHTML = `
        <nav>
            <a href="index.html"><img class="logo" src="img/logo.png" alt="Logo"></a>
            <button class="menu-toggle" aria-label="Abrir menú">☰</button>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html">Inicio</a></li>
                <li id="search-container" style="display: none;">
                    <input type="text" id="search-bar" placeholder="Buscar productos...">
                </li>
                <li id="cart-container" style="display: none;">
                    <a href="#"><span id="cart-icon">🛒</span><span id="cart-count">0</span></a>
                </li>
                <li><a href="contacto.html">Contacto</a></li>
                <li><a href="nosotros.html">Nosotros</a></li>
                <li id="admin-link" style="display: none;"><a href="alta.html">Alta de Productos</a></li>
                <li><a href="#" id="login-button">Iniciar sesión</a></li>
            </ul>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const searchContainer = document.getElementById("search-container");
    const searchBar = document.getElementById("search-bar");
    const productosContainer = document.getElementById("productos-container");
    const loginButton = document.getElementById("login-button");
    const adminLink = document.getElementById("admin-link");

    // Mostrar el buscador solo en index.html
    if (window.location.pathname.includes("index.html")) {
        searchContainer.style.display = "block";

        // Evento de búsqueda con corrección del centrado
        searchBar.addEventListener("input", function () {
            let filtro = searchBar.value.toLowerCase();
            let categorias = document.querySelectorAll("section[id^='productos-']");

            categorias.forEach((categoria) => {
                let productos = categoria.querySelectorAll(".producto-card");
                let hayProductosVisibles = false;

                productos.forEach((producto) => {
                    let nombre = producto.querySelector("h2").textContent.toLowerCase();
                    let bodega = producto.querySelector(".bodega").textContent.toLowerCase();
                    let tipoVino = producto.querySelector(".tipo-vino").textContent.toLowerCase();

                    if (nombre.includes(filtro) || bodega.includes(filtro) || tipoVino.includes(filtro)) {
                        producto.style.display = "block";
                        hayProductosVisibles = true;
                    } else {
                        producto.style.display = "none";
                    }
                });

                // Ocultar banner si no hay productos visibles
                const banner = categoria.querySelector(".banner");
                if (hayProductosVisibles) {
                    banner.style.display = "block";
                    categoria.style.display = "block";
                } else {
                    banner.style.display = "none";
                    categoria.style.display = "none";
                }
            });

            // Corregir el centrado de las cards
            productosContainer.style.display = "flex";
            productosContainer.style.justifyContent = "center";
            productosContainer.style.flexWrap = "wrap";
        });
    }

    // Funcionalidad de login corregida
    function iniciarSesion() {
        const usuario = prompt("Ingrese su usuario:");
        const contrasena = prompt("Ingrese su contraseña:");

        sessionStorage.setItem("usuario", usuario.charAt(0).toUpperCase() + usuario.slice(1).toLowerCase());

        if (usuario.toLowerCase() === "usuario" && contrasena.toLowerCase() === "123") {
            sessionStorage.setItem("rol", "ROLE_CONSULTA");
            actualizarEstadoSesion();
        } else if (usuario.toLowerCase() === "admin" && contrasena.toLowerCase() === "12345") {
            sessionStorage.setItem("rol", "ROLE_ADMINISTRADOR");
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
    if (rolGuardado) {
        actualizarEstadoSesion();
    }

    // Redirección si un usuario estándar intenta acceder a alta.html
    if (window.location.pathname.includes("alta.html") && sessionStorage.getItem("rol") !== "ROLE_ADMINISTRADOR") {
        window.location.href = "index.html";
    }
});
