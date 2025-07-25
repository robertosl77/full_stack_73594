// src/pages/Mensajes.jsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";
import MarcoContenido from "../components/MarcoContenido";

const Mensajes = ({ user }) => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    try {
      const res = await apiFetch(`/api/mensajes`);
      const resData = await res;
      setMensajes(resData.mensajes || []);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeido = async (id) => {
    try {
      const res = await apiFetch(`/api/mensajes/${id}/leido`, {
        method: 'PATCH',
      });

      if (res.success) {
        // setMensajes(prev => prev.filter(msg => msg._id !== id));
        cargarMensajes(); // reutilizás el useEffect original
      } else {
        alert("Error al marcar como leído");
      }
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error);
    }
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <MarcoContenido titulo="Mensajes de Contacto" ancho={1}>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Comentario</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.length > 0 ? (
              mensajes.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.tiempo}</td>
                  <td>{msg.nombre}</td>
                  <td>{msg.email}</td>
                  <td>{msg.comentario}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => marcarComoLeido(msg._id)}
                    >
                      Marcar como leído
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay mensajes no leídos.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </MarcoContenido>
  );
};

export default Mensajes;
