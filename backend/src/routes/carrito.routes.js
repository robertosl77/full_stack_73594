import express from 'express';
import Carrito from '../models/carrito.js';
import Producto from '../models/producto.js';
import Usuario from '../models/usuario.js';
import { 
  validaImagenProductos
  , tiempoTranscurrido 
  , verificarProductoCarrito
} from '../utils/funciones.js';
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
      return res.status(400).json({
        status: 400,
        error: 'Faltan datos requeridos.'
      });
    }

    try {
      // Validar existencia usuario
      if (!usuarioId.startsWith("999")) {
        const user = await Usuario.findById(usuarioId);
        if (!user) {
          return res.status(404).json({
            status: 404,
            error: 'Usuario no encontrado'
          });
        }
      }

      // Validar existencia y estado del producto
      const producto = await Producto.findById(productoId);
      if (!producto || !producto.estado) {
        return res.status(404).json({
          status: 404,
          error: 'Producto no disponible'
        });
      }

      // Buscar si ya hay carrito del usuario
      let carrito = await Carrito.findOne({ usuario: usuarioId });

      const existenteProducto = carrito?.productos.find(p => 
        p.producto.toString() === productoId && p.estado !== 0 && p.estado !== 3
      );
      const stock = existenteProducto?.cantidad || 0;

      // Valida diferencia de 
      if (cantidad > producto.stock-stock) {
        return res.status(400).json({
          status: 400,
          error: 'Stock insuficiente'
        });
      }

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
          // Actualizar existente sumando la cantidad
          const nuevaCantidad = existente.cantidad + cantidad;
          if (nuevaCantidad > producto.stock) {
            return res.status(400).json({
              status: 400,
              error: 'Stock insuficiente para la cantidad solicitada'
            });
          }

          existente.estado = 1;
          existente.cantidad = nuevaCantidad; // Sumar en lugar de sobrescribir
          existente.fecha_agregado = ahora;
          existente.fecha_eliminado = null;
        }

        await carrito.save();
      }

      // Recalcular cantidad actual en el carrito
      const carritoActualizado = await Carrito.findOne({ usuario: usuarioId });
      // const totalCantidad = carritoActualizado.productos
      //   .filter(p => p.estado === 1)
      //   .reduce((acc, p) => acc + p.cantidad, 0);

      const totalCantidad = carritoActualizado.productos
        .filter(p => p.estado === 1)
        .length;

      // Obtener stock actual del producto
      const productoActualizado = await Producto.findById(productoId);

      res.status(200).json({
        status: 200,
        success: 'Producto actualizado en el carrito',
        cantidadCarrito: totalCantidad,
        stockActual: productoActualizado.stock - cantidad - stock
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        error: 'Error al agregar al carrito'
      });
    }
  }
);

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

// Mover producto reservado a activo (estado 2 → 1)
router.put(
  '/api/carrito/activar', 
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
        p.producto.toString() === productoId && p.estado === 2
      );

      if (!producto) {
        return res.status(404).json({ error: 'Producto reservado no encontrado' });
      }

      producto.estado = 1;
      await carrito.save();

      res.json({ success: 'Producto movido a En Carrito' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al mover producto a En Carrito' });
    }
  }
);

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
      p.producto.toString() === productoId && p.estado === 1
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

/**
 * PUT /api/carrito/comprar
 * Body: { usuarioId: string, productos: [{ productoId, cantidad, precio, descuento }] }
 * Middlewares: verificarToken, permitirSolo(["ROLE_ADMINISTRADOR","ROLE_CLIENTE"])
 * Comportamiento:
 *  - Valida que cada producto esté en el carrito (estado 1 o 2) y coincidan cantidad/precio/descuento
 *  - Usa verificarProductoCarrito para validar existencia, estado, stock, precio y descuento
 *  - Si hay errores -> 400 { error:'validaciones_fallidas', productos:[...] }
 *  - Si todo OK -> pasa a estado 3 y descuenta stock. Devuelve { success:'Compra realizada con éxito' }
 */
router.put(
  '/api/carrito/comprar',
  verificarToken,
  permitirSolo(['ROLE_ADMINISTRADOR', 'ROLE_CLIENTE']),
  async (req, res) => {
    const { usuarioId, productos: productosFront } = req.body;

    if (!usuarioId || !Array.isArray(productosFront) || productosFront.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const carrito = await Carrito.findOne({ usuario: usuarioId });
      if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const respuesta = [];
      const productosOkMap = new Map(); // productoId -> Producto (para no reconsultar luego)

      // ============== VALIDACIONES ==============
      for (const pFront of productosFront) {
        // 1) Debe existir en carrito y estar activo (1) o reservado (2)
        const pCarrito = carrito.productos.find(
          p =>
            p.producto.toString() === pFront.productoId &&
            (p.estado === 1 || p.estado === 2)
        );

        if (!pCarrito) {
          respuesta.push({
            productoId: pFront.productoId,
            estado_final: 'error',
            motivo: 'producto no activo o reservado en el carrito',
          });
          continue;
        }

        // 2) Cantidad del front debe coincidir con la del carrito
        if (pCarrito.cantidad !== pFront.cantidad) {
          respuesta.push({
            productoId: pFront.productoId,
            estado_final: 'error',
            motivo: 'cantidad inconsistente',
            cantidad_actual: pCarrito.cantidad,
          });
          continue;
        }

        // 3) Validaciones centralizadas (existencia, estado, stock, precio, descuento)
        const check = await verificarProductoCarrito({
          productoId: pFront.productoId,
          cantidad: pFront.cantidad,
          precio: pFront.precio,
          descuento: pFront.descuento,
        });

        if (!check.valido) {
          const err = {
            productoId: pFront.productoId,
            estado_final: 'error',
            motivo: check.motivo,
          };
          if (check.precio_actual !== undefined) err.precio_actual = check.precio_actual;
          if (check.descuento_actual !== undefined) err.descuento_actual = check.descuento_actual;
          if (check.stock_maximo_permitido !== undefined) err.stock_maximo_permitido = check.stock_maximo_permitido;

          respuesta.push(err);
          continue;
        }

        // Ok
        productosOkMap.set(pFront.productoId, check.producto);
        respuesta.push({
          productoId: pFront.productoId,
          estado_final: 'ok',
        });
      }

      const hayErrores = respuesta.some(p => p.estado_final === 'error');
      if (hayErrores) {
        return res.status(400).json({
          error: 'validaciones_fallidas',
          productos: respuesta,
        });
      }

      // ============== ACTUALIZACIONES (estado y stock) ==============
      const ahora = new Date();

      // Pasar a estado 3 y descontar stock SOLO de los validados
      for (const pFront of productosFront) {
        const item = carrito.productos.find(
          c =>
            c.producto.toString() === pFront.productoId &&
            (c.estado === 1 || c.estado === 2)
        );

        if (item) {
          item.estado = 3;
          item.fecha_eliminado = ahora;

          // Usamos el producto ya cargado en validación para no reconsultar
          const producto = productosOkMap.get(pFront.productoId) ||
                           (await Producto.findById(item.producto)); // fallback
          if (producto) {
            producto.stock = Math.max(0, (producto.stock || 0) - item.cantidad);
            await producto.save();
          }
        }
      }

      await carrito.save();
      return res.json({ success: 'Compra realizada con éxito' });

    } catch (error) {
      console.error('Error en /api/carrito/comprar:', error);
      return res.status(500).json({ error: 'Error al procesar la compra' });
    }
  }
);

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
