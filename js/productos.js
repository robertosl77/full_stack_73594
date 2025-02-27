// Función para cargar una categoría con su banner y productos
document.addEventListener("DOMContentLoaded", function () {
    // Si no hay productos almacenados en sessionStorage, los guardamos
    sessionStorage.setItem("productos", JSON.stringify(productos()));

    cargarSeccion("vinos", productos, "img_categorias/vinos.avif", "Sección de Vinos");
    cargarSeccion("spirits", productos, "img_categorias/spirits.jpg", "Sección Spirits");
});

// Función para cargar una sección de productos
function cargarSeccion(categoria, obtenerProductos, imagenBanner, tituloBanner) {
    const productosContainer = document.getElementById("productos-container");

    if (!document.getElementById(`productos-${categoria}`)) {
        const seccion = crearSeccion(categoria, imagenBanner, tituloBanner);
        productosContainer.appendChild(seccion);

        renderizarProductos(seccion, categoria, obtenerProductos());
    }
}

// Función para crear una sección con banner
function crearSeccion(tipo, imagenBanner, tituloBanner) {
    const seccion = document.createElement("section");
    seccion.id = `productos-${tipo}`;
    seccion.innerHTML = `
        <div class="banner">
            <img src="${imagenBanner}" alt="Categoría ${tituloBanner}">
            <h2 class="titulo-banner">${tituloBanner}</h2>
        </div>
    `;
    return seccion;
}

// Función para renderizar productos dentro de una sección
function renderizarProductos(seccion, categoria, productos) {
    productos.forEach(producto => {
        if (producto.categoria===categoria) {
            seccion.appendChild(crearCardProducto(producto));
        }        
    });
}

// Función para crear una card de producto
function crearCardProducto(producto) {
    const div = document.createElement("div");
    div.classList.add("producto-card");

    const sinStock = producto.stock <= 0;
    const precio_descuento = calcularPrecioDescuento(producto);
    const nombreCorto = truncarNombre(producto.nombre);

    div.innerHTML = `
        ${producto.descuento > 0 ? `<div class="descuento">${producto.descuento}% OFF</div>` : ''}
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h2>${nombreCorto}</h2>
        <p class="bodega">${producto.bodega}</p>
        <p class="tipo">${producto.tipo}</p>
        <p class="precio">
            ${producto.descuento > 0 
                ? `<span class="precio-antiguo">$${producto.precio_original.toLocaleString()}</span> $${precio_descuento.toLocaleString()}`
                : `$${precio_descuento.toLocaleString()}`}
        </p>
        <p class="stock">Disponibles: ${producto.stock}</p>
        <div class="cantidad">
            <label for="cantidad${producto.id}">Cantidad:</label>
            <input type="number" id="cantidad${producto.id}" min="1" max="${producto.stock}" value="1" ${sinStock ? "disabled" : ""}>
        </div>
        <button class="agregar-carrito" ${sinStock ? "disabled style='background:gray;cursor:not-allowed;'" : ""}>
            ${sinStock ? "Sin stock" : "AGREGAR"}
        </button>
    `;
    return div;
}

// Función para calcular el precio con descuento
function calcularPrecioDescuento(producto) {
    return producto.descuento > 0 
        ? producto.precio_original * (1 - producto.descuento / 100)
        : producto.precio_original;
}

// Función para truncar el nombre del producto si es muy largo
function truncarNombre(nombre) {
    return nombre.length > 14 ? nombre.substring(0, 14) + "..." : nombre;
}

// Función para filtrar productos por nombre, bodega o tipo de vino
function filtrarProductos() {
    const filtro = sessionStorage.getItem("busqueda") || "";
    const categorias = document.querySelectorAll("section[id^='productos-']");

    categorias.forEach((categoria) => {
        let productos = categoria.querySelectorAll(".producto-card");
        let hayProductosVisibles = false;

        productos.forEach((producto) => {
            if (productoCoincide(producto, filtro)) {
                producto.classList.remove("oculto"); // Mostrar producto
                hayProductosVisibles = true;
            } else {
                producto.classList.add("oculto"); // Ocultar producto
            }
        });

        // Controlar visibilidad del banner y la sección completa
        controlarVisibilidadCategoria(categoria, hayProductosVisibles);
    });
}

// Nueva función para ocultar el banner si no hay productos
function controlarVisibilidadCategoria(categoria, hayProductosVisibles) {
    const banner = categoria.querySelector(".banner");

    if (hayProductosVisibles) {
        categoria.classList.remove("oculto-todo");
        if (banner) banner.classList.remove("oculto");
    } else {
        categoria.classList.add("oculto-todo");
        if (banner) banner.classList.add("oculto");
    }
}

function productoCoincide(producto, filtro) {
    const nombre = producto.querySelector("h2").textContent.toLowerCase();
    const bodega = producto.querySelector(".bodega").textContent.toLowerCase();
    const tipoVino = producto.querySelector(".tipo").textContent.toLowerCase();

    return nombre.includes(filtro) || bodega.includes(filtro) || tipoVino.includes(filtro);
}
