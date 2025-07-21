import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/apiFetch';
import MarcoContenido from '../components/MarcoContenido';
import ModalAbmProductos from '../modales/ModalAbmProductos';
import { getBasedirFromToken } from "../utils/tokenUtils"

const AbmProductos = () => {
  const basedir = getBasedirFromToken(); // obtiene la ruta base desde el token

  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarProductos = async () => {
    try {
      const res = await apiFetch('/api/abm');
      if (res?.productos) setProductos(res.productos);
    } catch (err) {
      console.error('Error cargando productos', err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleSeleccionar = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const cerrarModal = (actualizado = false) => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    if (actualizado) cargarProductos();
  };

  return (
    <MarcoContenido titulo="Gestión de Productos">
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Bodega</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod._id} onClick={() => handleSeleccionar(prod)} style={{ cursor: 'pointer' }}>
                <td>
                  <img src={`http://localhost:8081${basedir}/${prod.imagen}`} alt="imagen" style={{ height: '50px' }}
                    onError={(e) => { e.target.style.display = 'none'; }} />
                </td>
                <td>{prod.nombre}</td>
                <td>{prod.bodega}</td>
                <td>{prod.tipo}</td>
                <td>${prod.precio_original}</td>
                <td>{prod.descuento}%</td>
                <td>{prod.stock}</td>
                <td>{prod.estado ? 'Activo' : 'Desactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productoSeleccionado && (
        <ModalAbmProductos
          show={mostrarModal}
          onHide={cerrarModal}
          producto={productoSeleccionado}
        />
      )}
    </MarcoContenido>
  );
};

export default AbmProductos;
