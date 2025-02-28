document.addEventListener("DOMContentLoaded", function () {
    inicializarEventos();
    setTimeout(renderizarProductos, 100); // Espera un breve momento para renderizar correctamente
});

// Detectar cambios en el tamaño de la pantalla y recargar la vista
window.addEventListener("resize", function () {
    renderizarProductos();
});

// Función que decide qué vista cargar según el tamaño de la pantalla
function renderizarProductos() {
    let productosGuardados = JSON.parse(sessionStorage.getItem("productos"));

    if (!productosGuardados || productosGuardados.length === 0) {
        sessionStorage.setItem("productos", JSON.stringify(productos()));
    }

    const seccionModificacion = document.getElementById("seccion-modificacion");
    const seccionAlta = document.getElementById("seccion-alta");

    if (!seccionModificacion || !seccionAlta) return;

    seccionModificacion.innerHTML = ""; 
    seccionAlta.innerHTML = ""; 

    if (window.innerWidth > 768) {
        cargarProductosPantallaGrande();
    } else {
        cargarProductosPantallaMovil();
    }

    altaProductos();
}

function inicializarEventos() {
    const botonNuevoProducto = document.getElementById("toggle-alta");

    if (botonNuevoProducto) {
        botonNuevoProducto.addEventListener("click", mostrarSeccionAlta);
    }

    // Delegación de eventos para el formulario de alta
    document.body.addEventListener("submit", function (event) {
        if (event.target && event.target.id === "form-alta") {
            validarFormularioAlta(event);
        }
    });

    // Delegación de eventos para el botón cancelar dentro de `seccion-alta`
    document.body.addEventListener("click", function (event) {
        if (event.target && event.target.id === "cancelar-alta") {
            mostrarSeccionModificacion();
        }
    });
}

// Carga los productos activos en la tabla
function cargarProductosPantallaGrande() { 
    const tablaProductos = document.getElementById("seccion-modificacion");
    if (!tablaProductos) return; // Evitar errores si no existe el contenedor

    // Obtener productos desde sessionStorage
    let productosActivos = JSON.parse(sessionStorage.getItem("productos")) || [];
    productosActivos = productosActivos.filter(producto => producto.estado === true);

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
            <td>$${producto.precio_original}</td>
            <td>${producto.descuento}%</td>
            <td>${producto.stock}</td>
            <td class="acciones">
                <button class="modificar-precio" data-id="${producto.id}">Precio</button>
                <button class="modificar-descuento" data-id="${producto.id}">Descuento</button>
                <button class="modificar-stock" data-id="${producto.id}">Stock</button>
                <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila); // Agregar la fila al tbody
    });
}

function cargarProductosPantallaMovil(){
    const tablaProductos = document.getElementById("seccion-modificacion");
    if (!tablaProductos) return; // Evitar errores si no existe el contenedor

    // Obtener productos desde sessionStorage
    let productosActivos = JSON.parse(sessionStorage.getItem("productos")) || [];
    productosActivos = productosActivos.filter(producto => producto.estado === true);
    
    // Vista en tarjetas para móviles
    tablaProductos.classList.add("productos-grid"); // Aplicamos estilos en móviles
    productosActivos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-card">
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>Precio: <strong>$${producto.precio_original}</strong></p>
                <p>Stock: <strong>${producto.stock}</strong></p>
            </div>
            <div class="producto-botones">
                <button class="modificar-precio" data-id="${producto.id}">Precio</button>
                <button class="modificar-descuento" data-id="${producto.id}">Descuento</button>
                <button class="modificar-stock" data-id="${producto.id}">Stock</button>
                <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
            </div>
        `;
        tablaProductos.appendChild(card);
    });
}

// Sección de alta de productos
function altaProductos(){
    const tablaProductos = document.getElementById("seccion-alta");
    if (!tablaProductos) return; // Evitar errores si no existe el contenedor

    tablaProductos.innerHTML = `
        <h2>Agregar Nuevo Producto</h2>
        <form id="form-alta">
            <label>Imagen: <input type="file" name="imagen" accept="image/*" required></label>
            <label>Categoría:
                <select name="categoria" required>
                    <option value="">Seleccione una opcion</option>
                    <option value="vinos">Vinos</option>
                    <option value="spirits">Spirits</option>
                </select>
            </label>
            <label>Bodega: 
                <select name="bodega">
                    <option value="">Seleccione una opcion</option>
                    <option value="Mascota Vineyards">Mascota Vineyards</option>
                    <option value="Trapiche">Trapiche</option>
                    <option value="El Esteco">El Esteco</option>
                    <option value="Finca Las Moras">Finca Las Moras</option>
                    <option value="Navarro Correas">Navarro Correas</option>
                    <option value="La Liga de Enólogos">La Liga de Enólogos</option>
                    <option value="Elementos">Elementos</option>
                    <option value="Caja Combinada">Caja Combinada</option>
                    </select>
                    </label>
                    <label>Tipo: 
                    <select name="tipo">
                    <option value="">Seleccione una opcion</option>
                    <option value="Cabernet Sauvignon">Cabernet Sauvignon</option>
                    <option value="Cabernet Franc">Cabernet Franc</option>
                    <option value="Malbec">Malbec</option>
                    <option value="Pinot Noir">Pinot Noir</option>
                    <option value="Syrah">Syrah</option>
                    <option value="Tannat">Tannat</option>
                    <option value="Merlot">Merlot</option>
                    <option value="Red Blend">Red Blend</option>
                    <option value="Blend">Blend</option>
                    <option value="Petit Verdot">Petit Verdot</option>
                    <option value="Malbec – Cabernet Franc">Malbec – Cabernet Franc</option>
                    <option value="Mix">Mix</option>
                </select>
            </label>
            <label>Nombre: <input type="text" name="nombre" required></label>
            <label>Precio: <input type="number" name="precio" step="0.01" required></label>
            <label>Descuento: <input type="number" name="descuento" required></label>
            <label>Stock: <input type="number" name="stock" required></label>
            <div class="botones-form">
                <button type="submit">Agregar Producto</button>
                <button type="button" id="cancelar-alta">Cancelar</button>
            </div>
        </form>  
    `;
}

// Validación del formulario de alta
function validarFormularioAlta(event) {
    event.preventDefault();

    const imagen = "img_productos/"+document.querySelector("input[name='imagen']").files[0].name;
    const categoria = document.querySelector("select[name='categoria']").value.trim();
    const bodega = document.querySelector("select[name='bodega']").value.trim();
    const tipo = document.querySelector("select[name='tipo']").value.trim();
    const nombre = document.querySelector("input[name='nombre']").value.trim();
    const precio_original = parseFloat(document.querySelector("input[name='precio']").value.trim());
    const descuento = parseInt(document.querySelector("input[name='descuento']").value.trim());
    const stock = parseInt(document.querySelector("input[name='stock']").value.trim());

    let errores = [];

    if (!imagen) errores.push("Debe seleccionar una imagen.");
    if (!categoria) errores.push("Debe seleccionar una categoría.");
    if (!bodega) errores.push("Debe seleccionar una bodega.");
    if (!tipo) errores.push("Debe seleccionar un tipo.");
    if (!nombre) errores.push("El nombre no puede estar vacío.");
    if (!precio_original || isNaN(precio_original) || parseFloat(precio_original) <= 0) errores.push("El precio debe ser un número positivo.");
    if (descuento && (isNaN(descuento) || parseInt(descuento) < 0 || parseInt(descuento) > 100)) errores.push("El descuento debe estar entre 0 y 100.");
    if (!stock || isNaN(stock) || parseInt(stock) < 0) errores.push("El stock debe ser un número entero positivo.");

    mostrarErrores(errores);

    if (errores.length === 0) {
        guardarProducto({ imagen, categoria, bodega, tipo, nombre, precio: precio_original, descuento, stock });
    }
}

// Mostrar errores en el formulario
function mostrarErrores(errores) {
    const contenedorErrores = document.getElementById("errores-formulario");
    if (!contenedorErrores) return;

    contenedorErrores.innerHTML = "";

    if (errores.length > 0) {
        errores.forEach(error => {
            const mensajeError = document.createElement("div");
            mensajeError.classList.add("mensaje-error");
            mensajeError.textContent = error;
            contenedorErrores.appendChild(mensajeError);
        });
    }
}

function guardarProducto(producto) {
    // Obtener los productos actuales de sessionStorage o usar un array vacío si no existen
    let productosActuales = JSON.parse(sessionStorage.getItem("productos")) || [];

    // Asignar un nuevo ID único
    producto.id = productosActuales.length + 1;

    // Definir el estado en función del stock
    producto.estado = producto.stock > 0;

    // Agregar el nuevo producto
    productosActuales.push(producto);

    // Guardar en sessionStorage
    sessionStorage.setItem("productos", JSON.stringify(productosActuales));

    // Verificar si se guardó correctamente
    console.log("Productos en sessionStorage:", JSON.parse(sessionStorage.getItem("productos")));

    // Mostrar mensaje y resetear formulario
    alert("Producto agregado correctamente.");
    document.getElementById("form-alta").reset();

    // **FORZAR ACTUALIZACIÓN DEL DOM**
    setTimeout(() => {
        renderizarProductos();
    }, 100);
    
    mostrarSeccionModificacion();
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