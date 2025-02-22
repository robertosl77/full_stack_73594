document.addEventListener("DOMContentLoaded", function () {
    const productosContainer = document.getElementById("productos"); // Selecciona la sección de productos
    
    const div = document.createElement("div");
    div.classList.add("producto-card"); // Añade la clase para mantener los estilos
    div.innerHTML = `
        <div class="descuento">30% OFF</div>
        <img src="productos/cha_ar_punco_sc_1370x2400_1.webp" alt="Chañar Punco">
        <h2>Chañar Punco</h2>
        <p class="bodega">El Esteco</p>
        <p class="tipo-vino">Blend</p>
        <p class="precio"><span class="precio-antiguo">$69.614,00</span> $48.729,80</p>
        <p class="stock">Disponibles: 10</p>
        <div class="cantidad">
            <label for="cantidad1">Cantidad:</label>
            <input type="number" id="cantidad1" min="1" max="10" value="1">
        </div>
        <button class="agregar-carrito">AGREGAR</button>
    `;

    productosContainer.appendChild(div); // Inserta la nueva card dentro de la sección de productos
});
