import React, { useEffect, useState } from 'react';
import { Modal, Button, Tab, Nav, Table } from 'react-bootstrap';

function ModalCarrito({ show, onHide }) {
  const [key, setKey] = useState('activos');
  const [carrito, setCarrito] = useState({
    activos: [],
    reservados: [],
    comprados: []
  });

  useEffect(() => {
    if (show) {
      fetch('/carrito/listar')
        .then(res => res.json())
        .then(data => {
          setCarrito({
            activos: data.activos || [],
            reservados: data.reservados || [],
            comprados: data.comprados || []
          });
        })
        .catch(err => console.error('Error al cargar carrito', err));
    }
  }, [show]);

  const renderTabla = (items, estado) => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Total</th>
          {estado === 'activos' && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td>{item.nombre}</td>
            <td>{item.cantidad}</td>
            <td>${item.precio}</td>
            <td>${item.precio * item.cantidad}</td>
            {estado === 'activos' && (
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => modificarEstado(item._id, 2)}
                  className="me-2"
                >
                  Reservar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => eliminar(item._id)}
                >
                  Eliminar
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const modificarEstado = async (id, nuevoEstado) => {
    await fetch(`/carrito/estado/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    // Refrescar
    const r = await fetch('/carrito/listar');
    const json = await r.json();
    setCarrito({
      activos: json.activos || [],
      reservados: json.reservados || [],
      comprados: json.comprados || []
    });
  };

  const eliminar = async (id) => {
    await fetch(`/carrito/eliminar/${id}`, { method: 'DELETE' });
    const r = await fetch('/carrito/listar');
    const json = await r.json();
    setCarrito({
      activos: json.activos || [],
      reservados: json.reservados || [],
      comprados: json.comprados || []
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Carrito de Compras</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="activos">Activos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reservados">Reservados</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="comprados">Comprados</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="activos">
              {renderTabla(carrito.activos, 'activos')}
            </Tab.Pane>
            <Tab.Pane eventKey="reservados">
              {renderTabla(carrito.reservados, 'reservados')}
            </Tab.Pane>
            <Tab.Pane eventKey="comprados">
              {renderTabla(carrito.comprados, 'comprados')}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCarrito;
