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

    // Mostrar el buscador solo en index.html
    if (window.location.pathname.includes("index.html")) {
        searchContainer.style.display = "block";

        // Evento de búsqueda
        searchBar.addEventListener("input", function () {
            let filtro = searchBar.value.toLowerCase();
            let productos = document.querySelectorAll(".producto-card");

            productos.forEach(function (producto) {
                let nombre = producto.querySelector("h2").textContent.toLowerCase();
                let bodega = producto.querySelector(".bodega").textContent.toLowerCase();
                let tipoVino = producto.querySelector(".tipo-vino").textContent.toLowerCase();

                if (nombre.includes(filtro) || bodega.includes(filtro) || tipoVino.includes(filtro)) {
                    producto.style.display = "block";
                } else {
                    producto.style.display = "none";
                }
            });
        });
    }
});
