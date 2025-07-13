// src/pages/Contacto.jsx
import React, { useState } from 'react';
import MarcoContenido from "../components/MarcoContenido";
import { apiFetch } from "../utils/apiFetch";

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    comentario: '',
  });

  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/api/contacto`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setMensaje(res.success);
        setTipoMensaje('success');
        setFormData({ nombre: '', email: '', comentario: '' });
      } else {
        setMensaje(res.error || 'Error al enviar mensaje.');
        setTipoMensaje('danger');
      }

    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
      setTipoMensaje('danger');
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  return (
    <MarcoContenido ancho={4} titulo={"Contactenos"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-mail:</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="comentario" className="form-label">Comentario:</label>
          <textarea className="form-control" name="comentario" rows="4" value={formData.comentario} onChange={handleChange} required></textarea>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-dark">Enviar</button>
        </div>

        {mensaje && (
          <div className={`alert alert-${tipoMensaje} mt-3`}>
            {mensaje}
          </div>
        )}
      </form>
    </MarcoContenido>
  );
}

export default Contacto;
