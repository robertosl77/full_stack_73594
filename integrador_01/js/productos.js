// Función que devuelve los productos de vinos
function vinos() {
    return [
        {
            id: 1,
            descuento: 30,
            imagen: "img_productos/cha_ar_punco_sc_1370x2400_1.webp",
            nombre: "Chañar Punco",
            bodega: "El Esteco",
            tipo_vino: "Blend",
            precio_original: 69614.00,
            stock: 0
        },
        {
            id: 2,
            descuento: 40,
            imagen: "img_productos/mascota_estuche_x_2_botellas_1.webp",
            nombre: "Estuche Unánime",
            bodega: "Mascota Vineyards",
            tipo_vino: "Mix",
            precio_original: 81939.00,
            stock: 2
        },
        {
            id: 3,
            descuento: 0,
            imagen: "img_productos/altimus_sc_1370x2400_1.webp",
            nombre: "Altimus",
            bodega: "El Esteco",
            tipo_vino: "Blend",
            precio_original: 80254.00,
            stock: 32
        },
        {
            id: 4,
            descuento: 0,
            imagen: "img_productos/15_-_trapiche_tesoro_bolsa_inter_miami.webp",
            nombre: "Trapiche Tesoro",
            bodega: "Trapiche",
            tipo_vino: "Malbec",
            precio_original: 11966.46,
            stock: 32
        },
        {
            id: 5,
            descuento: 30,
            imagen: "img_productos/dada_caramel.webp",
            nombre: "DADÁ #9 Caramel",
            bodega: "Finca Las Moras",
            tipo_vino: "Blend",
            precio_original: 7140.00,
            stock: 32
        },
        {
            id: 6,
            descuento: 35,
            imagen: "img_productos/3_combo_degustacion_blancos.webp",
            nombre: "Combo Degustación Blancos",
            bodega: "Caja Combinada",
            tipo_vino: "Mix",
            precio_original: 103377.00,
            stock: 11
        },
        {
            id: 7,
            descuento: 35,
            imagen: "img_productos/combo_inter_campeon.webp",
            nombre: "Combo Inter Campeón",
            bodega: "Trapiche",
            tipo_vino: "Malbec",
            precio_original: 81450.00,
            stock: 1
        },
        {
            id: 8,
            descuento: 45,
            imagen: "img_productos/51943.webp",
            nombre: "La Mascota",
            bodega: "Mascota Vineyards",
            tipo_vino: "Malbec",
            precio_original: 15259.00,
            stock: 33
        },
        {
            id: 9,
            descuento: 40,
            imagen: "img_productos/coleccion_privada_chardonnay_80020_1.webp",
            nombre: "Colección Privada",
            bodega: "Navarro Correas",
            tipo_vino: "Chardonnay",
            precio_original: 8850.00,
            stock: 1
        }
    ];
}

// Función que devuelve los productos de spirits
function spirits() { // Antes era vinos(), ahora es spirits()
    return [
        {
            id: 10,
            descuento: 30,
            imagen: "img_productos/1_combo_dulzura_.webp",
            nombre: "Combo Dulzura",
            bodega: "Caja Combinada",
            tipo_vino: "Mix",
            precio_original: 77838.00,
            stock: 5
        },
        {
            id: 11,
            descuento: 30,
            imagen: "img_productos/whatsapp_image_2024-05-29_at_15.39.54.webp",
            nombre: "Gordon´s Pink Gin",
            bodega: "Gordon’s",
            tipo_vino: "Gin",
            precio_original: 17543.00,
            stock: 19
        },
        {
            id: 12,
            descuento: 0,
            imagen: "img_productos/30008_8.webp",
            nombre: "Johnnie Walker Swing",
            bodega: "Johnnie Walker",
            tipo_vino: "Whisky",
            precio_original: 125226.00,
            stock: 125
        }
    ];
}

// Función para cargar una categoría con su banner y productos
document.addEventListener("DOMContentLoaded", function () {
    inicializarProductos();
});

function inicializarProductos() {
    cargarSeccion("vinos", vinos, "img_categorias/vinos.avif", "Sección de Vinos");
    cargarSeccion("spirits", spirits, "img_categorias/spirits.jpg", "Sección Spirits");
}

// Función para cargar una sección de productos
function cargarSeccion(tipo, obtenerProductos, imagenBanner, tituloBanner) {
    const productosContainer = document.getElementById("productos-container");

    if (!document.getElementById(`productos-${tipo}`)) {
        const seccion = crearSeccion(tipo, imagenBanner, tituloBanner);
        productosContainer.appendChild(seccion);

        renderizarProductos(seccion, obtenerProductos());
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
function renderizarProductos(seccion, productos) {
    productos.forEach(producto => {
        seccion.appendChild(crearCardProducto(producto));
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
        <p class="tipo">${producto.tipo_vino}</p>
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
