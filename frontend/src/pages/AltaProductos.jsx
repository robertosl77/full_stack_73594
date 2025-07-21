// src/pages/AltaProductos.jsx
import React, { useEffect, useState } from 'react';
import ModalAltaProductos from '../modales/ModalAltaProductos';
import { apiFetch } from '../utils/apiFetch';
import MarcoContenido from '../components/MarcoContenido';

const AltaProductos = () => {
  const [formData, setFormData] = useState({
    nombre: '', imagen: null, bodega: '', bodegaOtro: '', tipo: '', tipoOtro: '', precio_original: '', descuento: 0, stock: 0
  });
  const [errorImagen, setErrorImagen] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [existentes, setExistentes] = useState({ nombres: [], bodegas: [], tipos: [] });

  useEffect(() => {
    apiFetch('/api/alta')
      .then(res => {
        const d = res.data;
        setExistentes({
          nombres: JSON.parse(d.nombresExistentes),
          bodegas: d.bodegasExistentes,
          tipos: d.tiposExistentes
        });
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    const tipos = ['image/jpeg', 'image/png', 'image/webp'];
    if (file && !tipos.includes(file.type)) {
      setErrorImagen('Solo se permiten archivos JPEG, PNG o WebP.');
      setShowModal(true);
      e.target.value = '';
    } else {
      setFormData(prev => ({ ...prev, imagen: file }));
    }
  };

  const validarExistente = (campo, valor) => existentes[campo].includes(valor.trim().toLowerCase());


  const handleSubmit = async e => {
    e.preventDefault();

    const datos = new FormData();
    for (const key in formData) datos.append(key, formData[key]);
    datos.append('categoria', 'vinos');

    try {
      const res = await apiFetch('/api/alta', {
        method: 'POST',
        body: datos
      });

      if (!res || res.error) throw new Error(res.error || 'Error al guardar producto');
      alert('Producto creado correctamente');
    } catch (err) {
      setErrorImagen(err.message);
      setShowModal(true);
    }
  };

  return (
    <MarcoContenido titulo="Alta de Producto" ancho={1}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Nombre del producto</label>
          <input type="text" className="form-control" name="nombre" required value={formData.nombre} onChange={handleChange} />
          {validarExistente('nombres', formData.nombre) && <div className="alert alert-danger mt-2">El nombre del producto ya existe.</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen del producto</label>
          <input type="file" className="form-control" name="imagen" accept="image/*" required onChange={handleFile} />
        </div>

        <div className="mb-3 row">
          <div className="col-sm-6">
            <label className="form-label">Bodega</label>
            <select className="form-select" name="bodega" required value={formData.bodega} onChange={handleChange}>
              <option value="" disabled>Seleccione una bodega</option>
              {existentes.bodegas.map(b => <option key={b} value={b}>{b}</option>)}
              <option value="otro">Otro...</option>
            </select>
          </div>
          <div className="col-sm-6">
            <label className="form-label">Nueva bodega (si aplica)</label>
            <input className="form-control" name="bodegaOtro" disabled={formData.bodega !== 'otro'} required={formData.bodega === 'otro'} value={formData.bodegaOtro} onChange={handleChange} />
            {formData.bodega === 'otro' && validarExistente('bodegas', formData.bodegaOtro) && <div className="alert alert-danger mt-2">Esa bodega ya existe.</div>}
          </div>
        </div>

        <div className="mb-3 row">
          <div className="col-sm-6">
            <label className="form-label">Tipo</label>
            <select className="form-select" name="tipo" required value={formData.tipo} onChange={handleChange}>
              <option value="" disabled>Seleccione un tipo</option>
              {existentes.tipos.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="otro">Otro...</option>
            </select>
          </div>
          <div className="col-sm-6">
            <label className="form-label">Nuevo tipo (si aplica)</label>
            <input className="form-control" name="tipoOtro" disabled={formData.tipo !== 'otro'} required={formData.tipo === 'otro'} value={formData.tipoOtro} onChange={handleChange} />
            {formData.tipo === 'otro' && validarExistente('tipos', formData.tipoOtro) && <div className="alert alert-danger mt-2">Ese tipo ya existe.</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-4">
            <label className="form-label">Precio</label>
            <input type="number" step="0.01" className="form-control" name="precio_original" required value={formData.precio_original} onChange={handleChange} />
          </div>
          <div className="col-sm-4">
            <label className="form-label">Descuento (%)</label>
            <input type="number" min="0" max="100" className="form-control" name="descuento" value={formData.descuento} onChange={handleChange} />
          </div>
          <div className="col-sm-4">
            <label className="form-label">Stock</label>
            <input type="number" min="0" className="form-control" name="stock" value={formData.stock} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-success">Guardar producto</button>
      </form>

      <ModalAltaProductos show={showModal} onHide={() => setShowModal(false)} mensaje={errorImagen} />
    </MarcoContenido>
  );
};

export default AltaProductos;
