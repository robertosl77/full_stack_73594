import Producto from '../models/producto.js';

export async function obtenerProductosConDescuento() {
    const productos = await Producto.find();
    return productos.map(p => ({
        ...p.toObject(),
        precioDescuento: p.descuento > 0 
            ? Math.round(p.precio_original * (1 - p.descuento / 100)) 
            : p.precio_original
    }));
}
