// src/components/admin/AbmProductos.jsx
import { useState, useEffect } from "react";
import ModalEditarProducto from "../modales/ModalEditarProducto";
import { apiFetch } from "../utils/apiFetch";

const AbmProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await apiFetch("/api/admin/abmProductos");
        setProductos(res.productos || []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, []);

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gestión de Productos</h2>

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
          {productos.map((p) => (
            <tr key={p._id} onClick={() => abrirModal(p)} style={{ cursor: "pointer" }}>
              <td>
                <img src={`/${p.imagen}`} alt="imagen" style={{ height: "50px" }} />
              </td>
              <td>{p.nombre}</td>
              <td>{p.bodega}</td>
              <td>{p.tipo}</td>
              <td>${p.precio_original}</td>
              <td>{p.descuento}%</td>
              <td>{p.stock}</td>
              <td>{p.estado ? "Activo" : "Desactivo"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && productoSeleccionado && (
        <ModalEditarProducto
          producto={productoSeleccionado}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
};

export default AbmProductos;
