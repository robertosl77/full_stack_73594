document.addEventListener("DOMContentLoaded", function () {
    crearHeader();
    inicializarLogin();
    inicializarBuscador();
    actualizarEstadoSesion();
    verificarAccesoAlta();
    actualizarCarrito();
});

function crearHeader() {
    const header = document.createElement("header");
    header.innerHTML = `
        <nav>
            <a href="index.html"><img class="logo" src="img_logo/logo.png" alt="Logo"></a>
            <button class="menu-toggle" aria-label="Abrir menú">☰</button>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html">Inicio</a></li>
                <li id="search-container" style="display: none;">
                    <input type="text" id="search-bar" placeholder="Buscar productos...">
                </li>
                <li id="cart-container" style="display: none; position: relative;">
                    <a href="#"><span id="cart-icon">🛒</span><span id="cart-count" class="cart-count" style="display: none;">0</span></a>
                </li>
                <li><a href="contacto.html">Contacto</a></li>
                <li><a href="nosotros.html">Nosotros</a></li>
                <li id="admin-link" style="display: none;"><a href="alta.html">Alta de Productos</a></li>
                <li><a href="#" id="login-button">Iniciar sesión</a></li>
            </ul>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);
}

function inicializarLogin() {
    const loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", function () {
        if (sessionStorage.getItem("usuario")) {
            cerrarSesion();
        } else {
            iniciarSesion();
        }
    });
}

function iniciarSesion() {
    const usuario = prompt("Ingrese su usuario:");
    const contrasena = prompt("Ingrese su contraseña:");

    if (!usuario || !contrasena) {
        alert("Debe completar ambos campos.");
        return;
    }

    sessionStorage.setItem("usuario", usuario.charAt(0).toUpperCase() + usuario.slice(1).toLowerCase());

    if (usuario.toLowerCase() === "usuario" && contrasena === "123") {
        sessionStorage.setItem("rol", "ROLE_CONSULTA");
    } else if (usuario.toLowerCase() === "admin" && contrasena === "12345") {
        sessionStorage.setItem("rol", "ROLE_ADMINISTRADOR");
    } else {
        alert("Usuario o contraseña incorrectos");
        return;
    }

    actualizarEstadoSesion();
}

function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("rol");
    actualizarEstadoSesion();
    actualizarCarrito();
}

function actualizarEstadoSesion() {
    const loginButton = document.getElementById("login-button");
    const adminLink = document.getElementById("admin-link");
    const usuario = sessionStorage.getItem("usuario");
    const rol = sessionStorage.getItem("rol");

    if (usuario) {
        loginButton.innerText = usuario;
        adminLink.style.display = rol === "ROLE_ADMINISTRADOR" ? "block" : "none";
    } else {
        loginButton.innerText = "Iniciar sesión";
        adminLink.style.display = "none";
    }
}

function verificarAccesoAlta() {
    if (window.location.pathname.includes("alta.html") && sessionStorage.getItem("rol") !== "ROLE_ADMINISTRADOR") {
        window.location.href = "index.html";
    }
}

function inicializarBuscador() {
    const searchContainer = document.getElementById("search-container");
    const searchBar = document.getElementById("search-bar");
    const cartContainer = document.getElementById("cart-container");

    if (!window.location.pathname.includes("index.html")) return;

    searchContainer.style.display = "block";
    cartContainer.style.display = "block";

    searchBar.addEventListener("input", function () {
        sessionStorage.setItem("busqueda", searchBar.value.toLowerCase());
        filtrarProductos(); // Llamamos a la función en productos.js
    });
}

function actualizarCarrito() {
    const cartCount = document.getElementById("cart-count");
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    if (totalProductos > 0) {
        cartCount.textContent = totalProductos > 9 ? "9+" : totalProductos;
        cartCount.style.display = "block";
    } else {
        cartCount.style.display = "none";
    }
}
