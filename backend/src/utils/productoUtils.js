import Producto from '../models/producto.js';

// Obtener valores únicos para un campo
export async function getProductos(campo) {
  const productos = await Producto.find({}, campo);
  const nombres = productos.map(p => p[campo]?.toLowerCase()).filter(Boolean);
  const unicos = [...new Set(nombres)].sort();
  return unicos;
}

// Procesar campo personalizado (bodega o tipo)
export function obtenerCampoFinal(valorSeleccionado, valorOtro) {
  if (valorSeleccionado === 'otro' && valorOtro?.trim()) {
    return valorOtro.trim();
  }
  return valorSeleccionado?.trim();
}

// Validar números con límites opcionales
export function validarNumero(valor, nombreCampo, { min = null, max = null } = {}) {
  const num = parseFloat(valor);
  if (isNaN(num)) {
    throw new Error(`${nombreCampo} debe ser un número válido`);
  }
  if (min !== null && num < min) {
    throw new Error(`${nombreCampo} no puede ser menor que ${min}`);
  }
  if (max !== null && num > max) {
    throw new Error(`${nombreCampo} no puede ser mayor que ${max}`);
  }
  return num;
}

// Preparar contexto para el formulario
export async function getAltaProductoContext() {
  const nombresExistentes = await getProductos('nombre');
  const bodegasExistentes = await getProductos('bodega');
  const tiposExistentes = await getProductos('tipo');

  return {
    basedir: process.env.BASEDIR,
    nombresExistentes: JSON.stringify(nombresExistentes),
    bodegasExistentes,
    bodegasJSON: JSON.stringify(bodegasExistentes),
    tiposExistentes,
    tiposJSON: JSON.stringify(tiposExistentes)
  };
}