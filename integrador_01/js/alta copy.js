document.addEventListener("DOMContentLoaded", function () {
    inicializarEventos();
    cargarProductosEnTabla();
});

function inicializarEventos() {
    const botonNuevoProducto = document.getElementById("toggle-alta");
    const botonCancelar = document.getElementById("cancelar-alta");

    botonNuevoProducto.addEventListener("click", mostrarSeccionAlta);
    botonCancelar.addEventListener("click", mostrarSeccionModificacion);
}

// Muestra la sección de alta y oculta la de modificación
function mostrarSeccionAlta() {
    document.getElementById("seccion-alta").style.display = "block";
    document.getElementById("seccion-modificacion").style.display = "none";
    document.getElementById("toggle-alta").style.display = "none";
}

// Muestra la sección de modificación y oculta la de alta
function mostrarSeccionModificacion() {
    document.getElementById("seccion-alta").style.display = "none";
    document.getElementById("seccion-modificacion").style.display = "block";
    document.getElementById("toggle-alta").style.display = "block";
}

// Carga los productos activos en la tabla
function cargarProductosEnTabla() {
    const tablaProductos = document.getElementById("tabla-productos");
    const productosActivos = obtenerProductosActivos();

    // Limpiar la tabla antes de volver a cargar
    tablaProductos.innerHTML = "";

    if (window.innerWidth > 768) {
        // Vista en tabla para escritorio
        productosActivos.forEach(producto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-tabla"></td>
                <td>${producto.categoria}</td>
                <td>${producto.tipo}</td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio_original.toLocaleString()}</td>
                <td>${producto.descuento}%</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="modificar-precio" data-id="${producto.id}">Modificar Precio</button>
                    <button class="modificar-descuento" data-id="${producto.id}">Modificar Descuento</button>
                    <button class="modificar-stock" data-id="${producto.id}">Modificar Stock</button>
                    <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
                </td>
            `;
            tablaProductos.appendChild(fila);
        });
    } else {
        // Vista en tarjetas para móviles
        tablaProductos.classList.add("productos-grid"); // Aplicamos estilos en móviles

        productosActivos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("producto-card");
            card.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-card">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p><strong>${producto.categoria}</strong> - ${producto.tipo}</p>
                    <p>Precio: <strong>$${producto.precio_original.toLocaleString()}</strong></p>
                    <p>Stock: <strong>${producto.stock}</strong></p>
                </div>
                <div class="producto-botones">
                    <button class="modificar-precio" data-id="${producto.id}">Precio</button>
                    <button class="modificar-stock" data-id="${producto.id}">Stock</button>
                    <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
                </div>
            `;
            tablaProductos.appendChild(card);
        });
    }
}

// Obtiene los productos activos desde productos.js
function obtenerProductosActivos() {
    return productos().filter(producto => producto.estado === true);
}
