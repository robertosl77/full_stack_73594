// src/utils/funciones.js
import fs from 'fs';
import path from 'path';
import Producto from '../models/producto.js';

export function tiempoTranscurrido(fecha) {
    if (!fecha) return '';

    const now = new Date();
    const then = new Date(fecha);
    const diffMs = now - then; // Diferencia en milisegundos
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec} segundos`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutos`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `${diffHoras} horas`;
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 7) return `${diffDias} días`;
    const diffSemanas = Math.floor(diffDias / 7);
    if (diffSemanas < 4) return `${diffSemanas} semanas`;
    const diffMeses = Math.floor(diffDias / 30);
    if (diffMeses < 12) return `${diffMeses} meses`;
    const diffAnios = Math.floor(diffDias / 365);
    return `${diffAnios} años`;
}

export function imagenNoDisponible(img) {
  img.style.display = 'none';

  const aviso = document.createElement('div');
  aviso.className = 'text-danger text-center small mt-2';
  aviso.innerText = 'La imagen no está disponible o fue movida.';

  // Evitar múltiples avisos si ya fue insertado
  if (!img.parentElement.querySelector('.text-danger')) {
    img.parentElement.appendChild(aviso);
  }
}

/**
 * Asegura que cada producto tenga una imagen válida.
 * Si no existe o está vacía, se asigna una imagen por defecto.
 */
export function validaImagenProductos(productos) {

  const rutaImagenes = path.join(process.cwd(), 'public', 'img_productos');
  const imagenFallback = 'img_productos/Imagen_no_disponible.svg.png';

  return productos.map(producto => {
    const archivo = path.basename(producto.imagen || '');
    const rutaCompleta = path.join(rutaImagenes, archivo);

    if (!producto.imagen || !fs.existsSync(rutaCompleta)) {
      console.log(`Imagen NO válida para el producto ${producto.nombre}: ${producto.imagen}`);
      return { ...producto, imagen: imagenFallback };
    } else {
      console.log(`Imagen válida para el producto ${producto.nombre}: ${producto.imagen}`);
    }

    return producto;
  });
}

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

// Ajusta el stock de productos según el carrito del usuario
export function ajustarStockConCarrito(productos, carrito) {
  if (!carrito || !Array.isArray(carrito.productos)) return productos;

  const itemsCarrito = carrito.productos.filter(p => p.estado === 1 || p.estado === 2);

  productos.forEach(prod => {
    const item = itemsCarrito.find(p => p.producto.toString() === prod._id.toString());
    if (item) {
      prod.stock = Math.max(0, prod.stock - item.cantidad);
    }
  });

  return productos;
}

