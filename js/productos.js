function vinos() {
    return [
        {
            id: 1,
            descuento: 30,
            imagen: "productos/cha_ar_punco_sc_1370x2400_1.webp",
            nombre: "Chañar Punco",
            bodega: "El Esteco",
            tipo_vino: "Blend",
            precio_original: 69614.00,
            stock: 10
        },
        {
            id: 2,
            descuento: 40,
            imagen: "productos/mascota_estuche_x_2_botellas_1.webp",
            nombre: "Estuche Unánime",
            bodega: "Mascota Vineyards",
            tipo_vino: "Mix",
            precio_original: 81939.00,
            stock: 2
        },
        {
            id: 3,
            descuento: 0,
            imagen: "productos/altimus_sc_1370x2400_1.webp",
            nombre: "Altimus",
            bodega: "El Esteco",
            tipo_vino: "Blend",
            precio_original: 80254.00,
            stock: 32
        },
        {
            id: 4,
            descuento: 0,
            imagen: "productos/15_-_trapiche_tesoro_bolsa_inter_miami.webp",
            nombre: "Trapiche Tesoro",
            bodega: "Trapiche",
            tipo_vino: "Malbec",
            precio_original: 11966.46,
            stock: 32
        }
    ];
}

document.addEventListener("DOMContentLoaded", function () {
    const productos = vinos();
    const productosContainer = document.getElementById("productos");
    productos.forEach(producto => {
        const precio_descuento = producto.descuento > 0 
            ? producto.precio_original * (1 - producto.descuento / 100)
            : producto.precio_original;
        
        const nombreCorto = producto.nombre.length > 15 
            ? producto.nombre.substring(0, 15) + "..." 
            : producto.nombre;
        
        const div = document.createElement("div");
        div.classList.add("producto-card");
        div.innerHTML = `
            ${producto.descuento > 0 ? `<div class="descuento">${producto.descuento}% OFF</div>` : ''}
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${nombreCorto}</h2>
            <p class="bodega">${producto.bodega}</p>
            <p class="tipo-vino">${producto.tipo_vino}</p>
            <p class="precio">
                ${producto.descuento > 0 
                    ? `<span class="precio-antiguo">$${producto.precio_original.toLocaleString()}</span> $${precio_descuento.toLocaleString()}`
                    : `$${precio_descuento.toLocaleString()}`}
            </p>
            <p class="stock">Disponibles: ${producto.stock}</p>
            <div class="cantidad">
                <label for="cantidad${producto.id}">Cantidad:</label>
                <input type="number" id="cantidad${producto.id}" min="1" max="${producto.stock}" value="1">
            </div>
            <button class="agregar-carrito">AGREGAR</button>
        `;
        productosContainer.appendChild(div);
    });
});