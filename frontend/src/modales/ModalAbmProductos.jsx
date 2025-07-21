import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { apiFetch } from '../utils/apiFetch';
import { FaSave, FaTrash, FaPowerOff } from 'react-icons/fa';

const ModalAbmProductos = ({ show, onHide, producto }) => {
  const [formData, setFormData] = useState({
    id: '', nombre: '', imagen: null,
    bodega: '', bodegaOtro: '', tipo: '', tipoOtro: '',
    precio_original: '', descuento: 0, stock: 0
  });
  const [existentes, setExistentes] = useState({ bodegas: [], tipos: [] });

  useEffect(() => {
    if (producto) {
      setFormData({
        id: producto._id,
        nombre: producto.nombre || '',
        imagen: null,
        bodega: producto.bodega || '',
        bodegaOtro: '',
        tipo: producto.tipo || '',
        tipoOtro: '',
        precio_original: producto.precio_original || '',
        descuento: producto.descuento || 0,
        stock: producto.stock || 0
      });
    }

    apiFetch('/api/alta').then(res => {
      const d = res.data;
      setExistentes({
        bodegas: d.bodegasExistentes,
        tipos: d.tiposExistentes
      });
    }).catch(err => console.error(err));
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, imagen: file }));
  };

  const enviarForm = async (e) => {
    e.preventDefault();
    const datos = new FormData();
    for (const key in formData) datos.append(key, formData[key]);

    try {
      const res = await apiFetch('/api/abm/modifica', {
        method: 'POST',
        body: datos
      });

      if (res.error) throw new Error(res.error);
      alert('Producto actualizado');
      onHide(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const eliminarProducto = async () => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      const res = await apiFetch('/api/abm/elimina', {
        method: 'POST',
        body: JSON.stringify({ id: formData.id }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.error) throw new Error(res.error);
      alert('Producto eliminado');
      onHide(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const deshabilitarProducto = async () => {
    if (!window.confirm('¿Deshabilitar este producto (stock = 0)?')) return;
    try {
      const res = await apiFetch('/api/abm/deshabilita', {
        method: 'POST',
        body: JSON.stringify({ id: formData.id }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.error) throw new Error(res.error);
      alert('Producto deshabilitado');
      onHide(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const validarExistente = (campo, valor) =>
    existentes[campo].includes(valor.trim().toLowerCase());

  return (
    <Modal show={show} onHide={() => onHide(false)} centered size="lg">
        <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={enviarForm} encType="multipart/form-data">
            <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Imagen (opcional)</Form.Label>
            <Form.Control type="file" name="imagen" accept="image/*" onChange={handleFile} />
            </Form.Group>

            <Row className="mb-3">
            <Col>
                <Form.Label>Bodega</Form.Label>
                <Form.Select name="bodega" value={formData.bodega} onChange={handleChange} required>
                <option value="" disabled>Seleccione una bodega</option>
                {existentes.bodegas.map(b => <option key={b} value={b}>{b}</option>)}
                <option value="otro">Otro...</option>
                </Form.Select>
            </Col>
            <Col>
                <Form.Label>Nueva bodega</Form.Label>
                <Form.Control name="bodegaOtro" disabled={formData.bodega !== 'otro'} required={formData.bodega === 'otro'} value={formData.bodegaOtro} onChange={handleChange} />
                {formData.bodega === 'otro' && validarExistente('bodegas', formData.bodegaOtro) && <div className="text-danger small mt-1">Esa bodega ya existe</div>}
            </Col>
            </Row>

            <Row className="mb-3">
            <Col>
                <Form.Label>Tipo</Form.Label>
                <Form.Select name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option value="" disabled>Seleccione un tipo</option>
                {existentes.tipos.map(t => <option key={t} value={t}>{t}</option>)}
                <option value="otro">Otro...</option>
                </Form.Select>
            </Col>
            <Col>
                <Form.Label>Nuevo tipo</Form.Label>
                <Form.Control name="tipoOtro" disabled={formData.tipo !== 'otro'} required={formData.tipo === 'otro'} value={formData.tipoOtro} onChange={handleChange} />
                {formData.tipo === 'otro' && validarExistente('tipos', formData.tipoOtro) && <div className="text-danger small mt-1">Ese tipo ya existe</div>}
            </Col>
            </Row>

            <Row className="mb-3">
            <Col>
                <Form.Label>Precio Original</Form.Label>
                <Form.Control type="number" step="0.01" name="precio_original" value={formData.precio_original} onChange={handleChange} required />
            </Col>
            <Col>
                <Form.Label>Descuento (%)</Form.Label>
                <Form.Control type="number" min="0" max="100" name="descuento" value={formData.descuento} onChange={handleChange} />
            </Col>
            <Col>
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} />
            </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-4">
            <Button type="submit" variant="primary">
                <FaSave className="me-2" /> Guardar
            </Button>
            <Button variant="secondary" onClick={deshabilitarProducto}>
                <FaPowerOff className="me-2" /> Deshabilitar
            </Button>
            <Button variant="danger" onClick={eliminarProducto}>
                <FaTrash className="me-2" /> Eliminar
            </Button>
            </div>

        </Form>
        </Modal.Body>
    </Modal>
  );
};

export default ModalAbmProductos;
