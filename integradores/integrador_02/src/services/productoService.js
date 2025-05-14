import Producto from '../models/producto.js';

export async function obtenerProductosConDescuento() {
    const productos = await Producto.find();
    return productos.map(p => {
        const precioDescuentoValor = p.descuento > 0 
            ? p.precio_original * (1 - p.descuento / 100) 
            : p.precio_original;

        const formatoPrecio = valor => new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);

        return {
            ...p.toObject(),
            precioDescuento: formatoPrecio(precioDescuentoValor),
            precioOriginalFormateado: formatoPrecio(p.precio_original)
        };
    });
}
