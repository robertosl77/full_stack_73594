import React, { useEffect, useState } from 'react';
import { Modal, Button, Tab, Nav, Table } from 'react-bootstrap';
import { apiFetch } from "../utils/apiFetch";

function ModalCarrito({ show, onHide, user }) {
  const [key, setKey] = useState('activos');
  const [carrito, setCarrito] = useState({
    activos: [],
    reservados: [],
    comprados: []
  });

  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const res = await apiFetch(`/api/carrito/${user._id}`, { method: 'GET' });
        const productos = res.productos || [];

        setCarrito({
          activos: productos.filter(p => p.estado === 1),
          reservados: productos.filter(p => p.estado === 2),
          comprados: productos.filter(p => p.estado === 3),
        });
      } catch (err) {
        console.error('Error al cargar carrito', err);
      }
    };

    if (show) cargarCarrito();
  }, [show, user]);


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
    await apiFetch(`/api/carrito/estado/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    const res = await apiFetch(`/api/carrito/${user._id}`);
    const productos = res.productos || [];

    setCarrito({
      activos: productos.filter(p => p.estado === 1),
      reservados: productos.filter(p => p.estado === 2),
      comprados: productos.filter(p => p.estado === 3),
    });
  };

  const eliminar = async (id) => {
    await apiFetch(`/api/carrito/eliminar/${id}`, { method: 'DELETE' });

    const res = await apiFetch(`/api/carrito/${user._id}`);
    const productos = res.productos || [];

    setCarrito({
      activos: productos.filter(p => p.estado === 1),
      reservados: productos.filter(p => p.estado === 2),
      comprados: productos.filter(p => p.estado === 3),
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
