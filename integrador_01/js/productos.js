// Función que devuelve los productos de vinos
function productos() {
    return [
        {
            id: 1,
            imagen: "img_productos/cha_ar_punco_sc_1370x2400_1.webp",
            categoria: "vinos",
            bodega: "El Esteco",
            tipo: "Blend",
            nombre: "Chañar Punco",
            precio_original: 69614.00,
            descuento: 30,
            stock: 0,
            estado: true,
        },
        {
            id: 2,
            imagen: "img_productos/mascota_estuche_x_2_botellas_1.webp",
            categoria: "vinos",
            bodega: "Mascota Vineyards",
            tipo: "Mix",
            nombre: "Estuche Unánime",
            precio_original: 81939.00,
            descuento: 40,
            stock: 2,
            estado: true,
        },
        {
            id: 3,
            imagen: "img_productos/altimus_sc_1370x2400_1.webp",
            categoria: "vinos",
            bodega: "El Esteco",
            tipo: "Blend",
            nombre: "Altimus",
            precio_original: 80254.00,
            descuento: 0,
            stock: 32,
            estado: true,
        },
        {
            id: 4,
            imagen: "img_productos/15_-_trapiche_tesoro_bolsa_inter_miami.webp",
            categoria: "vinos",
            bodega: "Trapiche",
            tipo: "Malbec",
            nombre: "Trapiche Tesoro",
            precio_original: 11966.46,
            descuento: 0,
            stock: 32,
            estado: true,
        },
        {
            id: 5,
            imagen: "img_productos/dada_caramel.webp",
            categoria: "vinos",
            bodega: "Finca Las Moras",
            tipo: "Blend",
            nombre: "DADÁ #9 Caramel",
            precio_original: 7140.00,
            descuento: 30,
            stock: 32,
            estado: true,
        },
        {
            id: 6,
            imagen: "img_productos/3_combo_degustacion_blancos.webp",
            categoria: "vinos",
            bodega: "Caja Combinada",
            tipo: "Mix",
            nombre: "Combo Degustación Blancos",
            precio_original: 103377.00,
            descuento: 35,
            stock: 11,
            estado: true,
        },
        {
            id: 7,
            imagen: "img_productos/combo_inter_campeon.webp",
            categoria: "vinos",
            bodega: "Trapiche",
            tipo: "Malbec",
            nombre: "Combo Inter Campeón",
            precio_original: 81450.00,
            descuento: 35,
            stock: 1,
            estado: true,
        },
        {
            id: 8,
            imagen: "img_productos/51943.webp",
            categoria: "vinos",
            bodega: "Mascota Vineyards",
            tipo: "Malbec",
            nombre: "La Mascota",
            precio_original: 15259.00,
            descuento: 45,
            stock: 33,
            estado: true,
        },
        {
            id: 9,
            imagen: "img_productos/coleccion_privada_chardonnay_80020_1.webp",
            categoria: "vinos",
            bodega: "Navarro Correas",
            tipo: "Chardonnay",
            nombre: "Colección Privada",
            precio_original: 8850.00,
            descuento: 40,
            stock: 1,
            estado: true,
        },
        {
            id: 10,
            imagen: "img_productos/1_combo_dulzura_.webp",
            categoria: "spirits",
            bodega: "Caja Combinada",
            tipo: "Mix",
            nombre: "Combo Dulzura",
            precio_original: 77838.00,
            descuento: 30,
            stock: 5,
            estado: true,
        },
        {
            id: 11,
            imagen: "img_productos/whatsapp_image_2024-05-29_at_15.39.54.webp",
            categoria: "spirits",
            bodega: "Gordon’s",
            tipo: "Gin",
            nombre: "Gordon´s Pink Gin",
            precio_original: 17543.00,
            descuento: 30,
            stock: 19,
            estado: true,
        },
        {
            id: 12,
            imagen: "img_productos/30008_8.webp",
            categoria: "spirits",
            bodega: "Johnnie Walker",
            tipo: "Whisky",
            nombre: "Johnnie Walker Swing",
            precio_original: 125226.00,
            descuento: 0,
            stock: 125,
            estado: true,
        }
    ];
}

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
