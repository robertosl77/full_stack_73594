document.addEventListener("DOMContentLoaded", function () {
    crearHeader();
    inicializarLogin();
    inicializarBuscador();
    actualizarEstadoSesion();
    verificarAccesoAlta();
    inicializarCarrito();
    inicializarMenuHamburguesa();
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
                    <a href="#">
                        <span id="cart-icon">🛒</span>
                        <span id="cart-count">0</span>
                    </a>
                </li>
                <li><a href="nosotros.html">Nosotros</a></li>
                <li><a href="contacto.html">Contacto</a></li>
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
    sessionStorage.removeItem("carrito"); // Se limpia el carrito al cerrar sesión
    actualizarEstadoSesion();
    actualizarContadorCarrito();
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

    if (!window.location.pathname.includes("index.html")) return;

    searchContainer.style.display = "block";

    searchBar.addEventListener("input", function () {
        sessionStorage.setItem("busqueda", searchBar.value.toLowerCase());
        filtrarProductos(); // Llamamos a la función en productos.js
    });
}

function inicializarCarrito() {
    const cartContainer = document.getElementById("cart-container");

    if (!window.location.pathname.includes("index.html")) {
        cartContainer.style.display = "none";
        return;
    }

    actualizarContadorCarrito(); // Asegura que el carrito se actualice correctamente
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("agregar-carrito")) {
            agregarAlCarrito(event.target);
        }
    });
}

function agregarAlCarrito(boton) {
    let cantidadInput = boton.parentElement.querySelector("input[type='number']");
    let cantidad = parseInt(cantidadInput.value, 10);
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    let productoId = boton.parentElement.querySelector("input").id.replace("cantidad", "");

    let productoEnCarrito = carrito.find(p => p.id === productoId);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({ id: productoId, cantidad });
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    let totalProductos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    let cartContainer = document.getElementById("cart-container");
    let cartCount = document.getElementById("cart-count");

    if (totalProductos > 0) {
        cartCount.textContent = totalProductos > 9 ? "9+" : totalProductos;
        cartCount.style.display = "block";
        cartContainer.style.display = "block"; // Asegura que el carrito se muestre
    } else {
        cartCount.style.display = "none";
        cartContainer.style.display = "none"; // Oculta el carrito si está vacío
    }
}

function inicializarMenuHamburguesa() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("nav-menu-visible");
        });
    }
}