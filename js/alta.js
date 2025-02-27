document.addEventListener("DOMContentLoaded", function () {
    inicializarEventos();
    if (window.innerWidth > 768) {
        cargarProductosPantallaGrande();
    } else {
        cargarProductosPantallaMovil();
    }
});

// Detectar cambios en el tamaño de la pantalla y recargar la vista
window.addEventListener("resize", function () {
    renderizarProductos();
});

// Función que decide qué vista cargar según el tamaño de la pantalla
function renderizarProductos() {
    const seccionModificacion = document.getElementById("seccion-modificacion");
    
    // Limpiar contenido antes de renderizar
    seccionModificacion.innerHTML = "";

    if (window.innerWidth > 768) {
        cargarProductosPantallaGrande();
    } else {
        cargarProductosPantallaMovil();
    }
}

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
function cargarProductosPantallaGrande() { 
    const tablaProductos = document.getElementById("seccion-modificacion");
    const productosActivos = obtenerProductosActivos();

    // Limpiar y reestructurar la sección
    tablaProductos.innerHTML = `
        <h2>Modificar/Eliminar Productos</h2>
        <table>
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Descuento</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-productos">
                <!-- Productos se insertarán aquí dinámicamente -->
            </tbody>
        </table>    
    `;

    // Seleccionar el tbody correctamente
    const tbody = document.getElementById("tabla-productos");

    // Iterar sobre los productos activos y agregar filas al tbody
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
        tbody.appendChild(fila); // Agregar la fila al tbody
    });
}

function cargarProductosPantallaMovil(){
    console.log("Cargando productos en vista móvil");
    const tablaProductos = document.getElementById("seccion-modificacion");
    const productosActivos = obtenerProductosActivos();
        
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

// Obtiene los productos activos desde productos.js
function obtenerProductosActivos() {
    return productos().filter(producto => producto.estado === true);
}
