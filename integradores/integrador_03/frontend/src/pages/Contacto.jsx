// src/pages/Contacto.jsx
import React, { useState } from 'react';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    comentario: '',
  });

  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(''); // "success" o "danger"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.success || 'Mensaje enviado correctamente.');
        setTipoMensaje('success');
        setFormData({ nombre: '', email: '', comentario: '' });
      } else {
        setMensaje(data.error || 'Error al enviar mensaje.');
        setTipoMensaje('danger');
      }

      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
      setTipoMensaje('danger');
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Contacto</h2>

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;
