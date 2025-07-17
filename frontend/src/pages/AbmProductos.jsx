// src/components/AbmProductos.jsx
import { useState, useEffect, useRef } from "react";
import ModalEditarProducto from "../modales/ModalEditarProducto";
import { apiFetch } from "../utils/apiFetch";
import MarcoContenido from "../components/MarcoContenido";

const AbmProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const tablaRef = useRef(null);
  const scrollY = useRef(0);

  const cargarProductos = async () => {
    try {
      const res = await apiFetch("/api/admin/abmProductos");
      setProductos(res.productos || []);
      // restaurar scroll
      setTimeout(() => {
        if (tablaRef.current) {
          tablaRef.current.scrollTop = scrollY.current;
        }
      }, 50);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirModal = (producto) => {
    scrollY.current = tablaRef.current?.scrollTop || 0;
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    cargarProductos();
  };

  return (
    <MarcoContenido ancho={1} titulo='Gestión de Productos'>
        <div
            className="table-responsive"
            ref={tablaRef}
            style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
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
        </div>

        {mostrarModal && productoSeleccionado && (
            <ModalEditarProducto
            producto={productoSeleccionado}
            onClose={cerrarModal}
            />
        )}
    </MarcoContenido>
  );
};

export default AbmProductos;
