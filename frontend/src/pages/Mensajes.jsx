// src/pages/Mensajes.jsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";
import MarcoContenido from "../components/MarcoContenido";
import ModalResponderMensaje from "../modales/ModalResponderMensaje";
import { Modal, Button } from "react-bootstrap";

const MS_EN_DIA = 86400000;

const Mensajes = () => {
  /* -------------------- estado -------------------- */
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalRespuesta, setShowModalRespuesta] = useState(false);
  const [destinatario, setDestinatario] = useState(null);

  const [showDetalle, setShowDetalle] = useState(false);
  const [msgDetalle, setMsgDetalle] = useState(null);

  /* -------------------- carga inicial -------------------- */
  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    try {
      const res = await apiFetch("/api/mensajes-con-respuestas"); // últimos 10
      setMensajes(res.mensajes || []);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- helpers -------------------- */
  const marcarComoLeido = async (id) => {
    try {
      const res = await apiFetch(`/api/mensajes/${id}/leido`, { method: "PATCH" });
      if (res.success) cargarMensajes();
      else alert("Error al marcar como leído");
    } catch (err) {
      console.error("Error al marcar mensaje como leído:", err);
    }
  };

  const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const headerVariant = (msg) => {
    if (msg.leido) return "secondary";       // gris
    if (msg.respondido) return "success";    // verde

    const dias = Math.floor(
      (Date.now() - new Date(msg.fecha).getTime()) / MS_EN_DIA
    );

    if (dias < 1) return "info";             // azul claro
    if (dias < 3) return "warning";          // amarillo
    return "danger";                         // rojo
  };

  /* ---------- handler cierre modal responder ---------- */
  const cerrarModalRespuesta = (actualizar) => {
    setShowModalRespuesta(false);
    if (actualizar) cargarMensajes();        // refresca colores/estado
  };

  /* -------------------- cargando -------------------- */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  /* -------------------- vista -------------------- */
  return (
    <>
      <MarcoContenido titulo="Mensajes de Contacto" ancho={1}>
        {mensajes.length === 0 ? (
          <div className="text-center my-3">No hay mensajes.</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {mensajes.map((msg) => (
              <div className="col" key={msg._id}>
                <div className="card h-100 shadow-sm">
                  {/* ---------- cabecera coloreada ---------- */}
                  <div
                    className={`px-2 py-1 rounded-top bg-${headerVariant(
                      msg
                    )} ${headerVariant(msg) !== "warning" ? "text-white" : ""}`}
                  >
                    <strong>{msg.nombre}</strong>
                    <span className="badge bg-light text-dark ms-2">
                      {msg.tiempo}
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <p className="small text-muted mb-2">{msg.email}</p>
                    <p className="card-text flex-grow-1">{msg.comentario}</p>

                    <div className="mt-2 d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setMsgDetalle(msg);
                          setShowDetalle(true);
                        }}
                      >
                        Respuestas&nbsp;
                        <span className="badge bg-light text-dark">
                          {msg.respuestas?.length || 0}
                        </span>
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!emailValido(msg.email)}
                        onClick={() => {
                          setDestinatario(msg);
                          setShowModalRespuesta(true);
                        }}
                      >
                        Responder
                      </button>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => marcarComoLeido(msg._id)}
                      >
                        Leído
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </MarcoContenido>

      {/* ---------- modal responder ---------- */}
      <ModalResponderMensaje
        show={showModalRespuesta}
        onHide={cerrarModalRespuesta}   // ← actualiza al cerrar si corresponde
        destinatario={destinatario}
      />

      {/* ---------- modal detalle respuestas ---------- */}
      <Modal
        show={showDetalle}
        onHide={() => setShowDetalle(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            Respuestas a {msgDetalle?.nombre} ({msgDetalle?.email})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Comentario original:</strong> {msgDetalle?.comentario}
          </p>
          <hr />
          {msgDetalle?.respuestas?.length ? (
            <ul className="list-group">
              {msgDetalle.respuestas.map((r, i) => (
                <li key={i} className="list-group-item">
                  <div className="fw-bold">
                    {r.usuario}{" "}
                    <small className="text-muted">({r.tiempoRespuesta})</small>
                  </div>
                  <div>{r.mensaje}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted">Sin respuestas registradas.</div>
          )}
          <div className="mt-3 text-end">
            <Button variant="secondary" onClick={() => setShowDetalle(false)}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Mensajes;
