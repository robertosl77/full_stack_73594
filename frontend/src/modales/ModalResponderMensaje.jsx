import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { apiFetch } from '../utils/apiFetch';

const ModalResponderMensaje = ({ show, onHide, destinatario }) => {
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (show && destinatario?.nombre) {
      setMensaje(`Hola ${destinatario.nombre}, queríamos agradecerte por tu consulta y con gusto te respondemos...`);
      setEnviado(false);
    }
  }, [show, destinatario]);

  const enviarRespuesta = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const datos = {
      email: destinatario.email,
      nombre: destinatario.nombre,
      asunto: 'Tu consulta fue respondida',
      mensaje
    };

    try {
      const res = await apiFetch('/api/mensajes/responder', {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.success) {
        setEnviado(true);
        setTimeout(() => onHide(true), 1500);
      } else {
        alert(res.error || 'Error al enviar respuesta');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal show={show} onHide={() => onHide(false)} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Responder a {destinatario?.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={enviarRespuesta}>
          <Form.Group className="mb-3">
            <Form.Label>Email destinatario</Form.Label>
            <Form.Control type="email" value={destinatario?.email || ''} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comentario recibido</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={destinatario?.comentario || ''}
              readOnly
              className="bg-light text-muted"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tu respuesta</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              disabled={enviado}
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="success" disabled={enviando || enviado}>
              {enviando ? 'Enviando...' : enviado ? 'Enviado' : 'Enviar'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalResponderMensaje;
