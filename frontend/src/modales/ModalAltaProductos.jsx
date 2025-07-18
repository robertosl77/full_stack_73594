// src/modales/ModalAltaProductos.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalAltaProductos = ({ show, onHide, mensaje }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Error al guardar producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{mensaje}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAltaProductos;
