function spirits() { // Antes era vinos(), ahora es spirits()
    return [
        {
            id: 1,
            descuento: 30,
            imagen: "productos/1_combo_dulzura_.webp",
            nombre: "Combo Dulzura",
            bodega: "Caja Combinada",
            tipo_vino: "Mix",
            precio_original: 77838.00,
            stock: 5
        },
        {
            id: 2,
            descuento: 30,
            imagen: "productos/whatsapp_image_2024-05-29_at_15.39.54.webp",
            nombre: "Gordon´s Pink Gin",
            bodega: "Gordon’s",
            tipo_vino: "Gin",
            precio_original: 17543.00,
            stock: 19
        },
        {
            id: 3,
            descuento: 0,
            imagen: "productos/30008_8.webp",
            nombre: "Johnnie Walker Swing",
            bodega: "Johnnie Walker",
            tipo_vino: "Whisky",
            precio_original: 125226.00,
            stock: 125
        }
    ];
}

document.addEventListener("DOMContentLoaded", function () {
    const productos = spirits(); // Antes llamaba a vinos(), ahora usa spirits()
    const productosContainer = document.getElementById("productos-spirits"); 
    productos.forEach(producto => {
        const precio_descuento = producto.descuento > 0 
            ? producto.precio_original * (1 - producto.descuento / 100)
            : producto.precio_original;
        
        const nombreCorto = producto.nombre.length > 14 
            ? producto.nombre.substring(0, 14) + "..." 
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
