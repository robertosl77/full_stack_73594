// src/utils/funciones.js
import fs from 'fs';
import path from 'path';
import Producto from '../models/producto.js';
import mongoose from 'mongoose';

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
      return { ...producto, imagen: imagenFallback };
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


// Valida si un producto es válido para operación de carrito
export async function verificarProductoCarrito({ productoId, cantidad, precio, descuento }) {
  try {
    // 1. Validar formato del productoId
    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      return { valido: false, motivo: 'ID de producto inválido' };
    }

    // 2. Validar que cantidad, precio y descuento sean válidos
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return { valido: false, motivo: 'Cantidad debe ser un número entero positivo' };
    }
    if (typeof precio !== 'number' || precio < 0) {
      return { valido: false, motivo: 'Precio debe ser un número no negativo' };
    }
    if (typeof descuento !== 'number' || descuento < 0 || descuento > 100) {
      return { valido: false, motivo: 'Descuento debe ser un número entre 0 y 100' };
    }

    // 3. Buscar el producto
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return { valido: false, motivo: 'Producto eliminado o no encontrado' };
    }

    // 4. Validar estado y habilitación
    if (!producto.estado) {
      return { valido: false, motivo: 'Producto deshabilitado' };
    }
    if (producto.habilitado === false) {
      return { valido: false, motivo: 'Producto no habilitado para la venta' };
    }

    // 5. Validar stock
    if (cantidad > producto.stock) {
      return {
        valido: false,
        motivo: 'Stock insuficiente',
        stock_maximo_permitido: producto.stock,
      };
    }

    // 6. Validar límite de unidades por compra (si aplica)
    if (producto.max_unidades_por_compra && cantidad > producto.max_unidades_por_compra) {
      return {
        valido: false,
        motivo: `Máximo ${producto.max_unidades_por_compra} unidades permitidas por compra`,
        max_unidades_permitidas: producto.max_unidades_por_compra,
      };
    }

    // 7. Validar precio
    if (producto.precio_original !== precio) {
      return {
        valido: false,
        motivo: 'Precio desactualizado',
        precio_actual: producto.precio_original,
      };
    }

    // 8. Validar descuento
    if (producto.descuento !== descuento) {
      return {
        valido: false,
        motivo: 'Descuento desactualizado',
        descuento_actual: producto.descuento,
      };
    }

    // 9. Validar precio final para Mercado Pago (mínimo 1 ARS)
    const precioFinal = descuento > 0 ? precio * (1 - descuento / 100) : precio;
    if (precioFinal < 1) {
      return {
        valido: false,
        motivo: 'El precio final del producto debe ser al menos 1 ARS para Mercado Pago',
      };
    }

    // 10. Validar vigencia de oferta (si aplica)
    if (producto.fecha_vigencia_oferta && new Date() > new Date(producto.fecha_vigencia_oferta)) {
      return {
        valido: false,
        motivo: 'La oferta del producto ha expirado',
        fecha_vigencia: producto.fecha_vigencia_oferta,
      };
    }

    // 11. Validar cambios recientes (concurrencia)
    const haceCincoMinutos = new Date(Date.now() - 5 * 60 * 1000);
    if (producto.updatedAt && new Date(producto.updatedAt) > haceCincoMinutos) {
      return {
        valido: false,
        motivo: 'El producto fue modificado recientemente, verifica los datos',
        ultima_modificacion: producto.updatedAt,
      };
    }

    // 12. Validar que el producto no esté agotado o en reabastecimiento
    if (producto.stock === 0 || (producto.estado_stock && producto.estado_stock === 'reabastecimiento')) {
      return {
        valido: false,
        motivo: 'Producto agotado o en reabastecimiento',
      };
    }

    // Todo válido
    return { valido: true, producto };
  } catch (error) {
    console.error('Error en verificarProductoCarrito:', error);
    return { valido: false, motivo: 'Error interno al verificar el producto' };
  }
}