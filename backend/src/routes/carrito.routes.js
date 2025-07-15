import express from 'express';
import Carrito from '../models/carrito.js';
import Producto from '../models/producto.js';
import Usuario from '../models/usuario.js';
import { validaImagenProductos, tiempoTranscurrido } from '../utils/funciones.js';
import { verificarToken, permitirSolo } from "../utils/token.js"

const router = express.Router();

// src/routes/carrito.routes.js
router.get(
  "/api/carrito/cantidad",
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
    try {
      const userId = req.user?._id;
      const carrito = await Carrito.findOne({ usuario: userId });
      const cantidad = carrito
        ? carrito.productos.filter(p => p.estado === 1 || p.estado === 2).length
        : 0;

      res.json({ cantidad });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "No se pudo obtener cantidad" });
    }
  }
);

// Agregar producto al carrito
router.post(
  '/api/carrito', 
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
  const usuarioId = req.user?._id;
  const { productoId, cantidad } = req.body;

  if (!usuarioId || !productoId || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  try {
    // Validar existencia usuario
    const user = await Usuario.findById(usuarioId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Validar existencia y estado del producto
    const producto = await Producto.findById(productoId);
    if (!producto || !producto.estado) {
      return res.status(404).json({ error: 'Producto no disponible' });
    }

    if (cantidad > producto.stock) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Buscar si ya hay carrito del usuario
    let carrito = await Carrito.findOne({ usuario: usuarioId });
    const ahora = new Date();

    if (!carrito) {
      carrito = await Carrito.create({
        usuario: usuarioId,
        productos: [{
          producto: productoId,
          cantidad,
          estado: 1,
          fecha_agregado: ahora,
          fecha_eliminado: null
        }]
      });
    } else {
      const existente = carrito.productos.find(p =>
        p.producto.toString() === productoId && p.estado !== 0 && p.estado !== 3
      );

      if (!existente || existente.estado === 0 || existente.estado === 3) {
        // Insertar nuevo
        carrito.productos.push({
          producto: productoId,
          cantidad,
          estado: 1,
          fecha_agregado: ahora,
          fecha_eliminado: null
        });
      } else if (existente.estado === 1 || existente.estado === 2) {
        // Actualizar existente
        if (cantidad > producto.stock) {
          return res.status(400).json({ error: 'Stock insuficiente' });
        }

        existente.estado = 1;
        existente.cantidad = cantidad;
        existente.fecha_agregado = ahora;
        existente.fecha_eliminado = null;
      }

      await carrito.save();
    }

    res.json({ success: 'Producto actualizado en el carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// Eliminar producto del carrito (marca como eliminado)
router.delete(
  '/api/carrito', 
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
  const { usuarioId, productoId } = req.body;

  if (!usuarioId || !productoId) {
    return res.status(400).json({ error: 'Faltan usuarioId o productoId' });
  }

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const producto = carrito.productos.find(p =>
      p.producto.toString() === productoId && p.estado !== 0
    );

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    producto.estado = 0;
    producto.fecha_eliminado = new Date();

    await carrito.save();
    res.json({ success: 'Producto eliminado del carrito' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
});

// Vaciar carrito (solo estado 1 y 2)
router.delete(
  '/api/carrito/vaciar', 
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
  const { usuarioId } = req.body;

  if (!usuarioId) {
    return res.status(400).json({ error: 'Falta usuarioId' });
  }

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    let productosModificados = 0;

    carrito.productos.forEach(p => {
      if (p.estado === 1 || p.estado === 2) {
        p.estado = 0;
        p.fecha_eliminado = new Date();
        productosModificados++;
      }
    });

    if (productosModificados === 0) {
      return res.json({ message: 'No había productos para vaciar' });
    }

    await carrito.save();
    res.json({ success: `Se vaciaron ${productosModificados} productos del carrito` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
});

// Reservar producto del carrito (cambia estado a 2)
router.put(
  '/api/carrito/reservar', 
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
  const { usuarioId, productoId } = req.body;

  if (!usuarioId || !productoId) {
    return res.status(400).json({ error: 'Faltan usuarioId o productoId' });
  }

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const producto = carrito.productos.find(p =>
      p.producto.toString() === productoId && p.estado === 1
    );

    if (!producto) {
      return res.status(404).json({ error: 'Producto activo no encontrado en el carrito' });
    }

    producto.estado = 2;
    await carrito.save();

    res.json({ success: 'Producto reservado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al reservar el producto' });
  }
});

// Actualizar cantidad de un producto en el carrito (sin modificar estado)
router.put(
  '/api/carrito/cantidad', 
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
  const { usuarioId, productoId, cantidad } = req.body;

  if (!usuarioId || !productoId || cantidad == null) {
    return res.status(400).json({ error: 'Faltan usuarioId, productoId o cantidad' });
  }

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const item = carrito.productos.find(p =>
      p.producto.toString() === productoId && p.estado !== 0
    );

    if (!item) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    const producto = await Producto.findById(productoId);
    if (!producto || !producto.estado) {
      return res.status(400).json({ error: 'Producto no disponible' });
    }

    if (cantidad > producto.stock) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    item.cantidad = cantidad;
    await carrito.save();

    res.json({ success: 'Cantidad actualizada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
});

// Confirmar compra: pasa productos activos o reservados a estado 3
router.put(
  '/api/carrito/comprar', 
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
  const { usuarioId, productos: productosFront } = req.body;

  if (!usuarioId || !Array.isArray(productosFront)) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const respuesta = [];
    const ahora = new Date();

    // Validar consistencia: cantidad de productos debe coincidir con los del carrito
    const carritoActivos = carrito.productos.filter(p => p.estado === 1);

    if (carritoActivos.length !== productosFront.length) {
      return res.status(400).json({
        error: 'inconsistencia_detectada',
        mensaje: 'La información del carrito no coincide con la registrada. Actualizá la página para sincronizar.',
        accion_sugerida: 'refresh'
      });
    }

    // Validar productos uno a uno
    for (const pFront of productosFront) {
      const pCarrito = carritoActivos.find(p => p.producto.toString() === pFront.productoId);

      if (!pCarrito) {
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'error',
          motivo: 'producto no registrado en el carrito'
        });
        continue;
      }

      const producto = await Producto.findById(pFront.productoId);

      if (!producto) {
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'error',
          motivo: 'producto eliminado'
        });
        continue;
      }

      if (!producto.estado) {
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'error',
          motivo: 'producto deshabilitado'
        });
        continue;
      }

      console.log(pCarrito.cantidad);
      console.log(producto.stock);
      if (pCarrito.cantidad > producto.stock) {
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'error',
          motivo: 'stock insuficiente',
          stock_maximo_permitido: producto.stock
        });
        continue;
      }

      if (pCarrito.cantidad !== pFront.cantidad) {
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'error',
          motivo: 'cantidad inconsistente',
          cantidad_actual: pCarrito.cantidad
        });
        continue;
      }

      if (producto.precio_original !== pFront.precio) {
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'error',
          motivo: 'precio desactualizado',
          precio_actual: producto.precio_original
        });
        continue;
      }

      if (producto.descuento !== pFront.descuento) {
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'error',
          motivo: 'descuento desactualizado',
          descuento_actual: producto.descuento
        });
        continue;
      }

      // Producto validado correctamente
      respuesta.push({
        productoId: pFront.productoId,
        estado_final: 'ok'
      });
    }

    // Verificar si hubo errores
    const hayErrores = respuesta.some(p => p.estado_final === 'error');
    if (hayErrores) {
      return res.status(400).json({
        error: 'validaciones_fallidas',
        productos: respuesta
      });
    }

    // Si todo está bien, proceder a marcar estado 3 y descontar stock
    for (const p of carritoActivos) {
      p.estado = 3;
      p.fecha_eliminado = ahora;
      const producto = await Producto.findById(p.producto);
      producto.stock -= p.cantidad;
      await producto.save();
    }

    await carrito.save();
    res.json({ success: 'Compra realizada con éxito' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
});

// Obtener productos del carrito con validaciones
router.get(
  '/api/carrito/:idUsuario', 
  verificarToken,
  permitirSolo(["ROLE_ADMINISTRADOR", "ROLE_CLIENTE"]),
  async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const carrito = await Carrito.findOne({ usuario: idUsuario }).populate('productos.producto');

    if (!carrito || !carrito.productos.length) {
      return res.json({ productos: [] });
    }

    const productosPreparados = carrito.productos.map(p => {
      const prod = p.producto;

      return {
        idProducto: prod?._id?.toString() || null,
        nombre: prod?.nombre || "Producto no disponible",
        imagen: prod?.imagen || null,
        eliminado: !prod,
        deshabilitado: prod?.habilitado === false,
        stock_actual: prod?.stock || 0,
        stock_maximo: prod?.stock || 0,
        stock_insuficiente: p.cantidad > (prod?.stock || 0),
        cantidad_solicitada: p.cantidad,
        precio_original: prod?.precio_original || 0,
        descuento_original: prod?.descuento || 0,
        estado: p.estado,
        fecha_agregado: p.fecha_agregado,
        fecha_eliminado: p.fecha_eliminado,
        fecha_compra: tiempoTranscurrido(p.fecha_eliminado)
      };
    });

    const productosConImagenes = validaImagenProductos(productosPreparados);

    res.json({ productos: productosConImagenes });

  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});




export default router;
