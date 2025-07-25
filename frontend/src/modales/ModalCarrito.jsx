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

        console.log('Carrito cargado:', productos);

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
            <td>{item.cantidad_solicitada}</td>
            <td>${item.precio_original}</td>
            <td>${(item.precio_original * item.cantidad_solicitada).toFixed(2)}</td>
            <td>
              {estado === 'activos' && (
                <>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => confirmarCompra(item.idProducto)}
                    className="me-2"
                  >
                    Comprar
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => modificarEstado(item.idProducto, 2)}
                    className="me-2"
                  >
                    Reservar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminar(item.idProducto)}
                  >
                    Eliminar
                  </Button>
                </>
              )}

              {estado === 'reservados' && (
                <>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => confirmarCompra(item.idProducto)}
                    className="me-2"
                  >
                    Comprar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminar(item.idProducto)}
                  >
                    Eliminar
                  </Button>
                </>
              )}

              {estado === 'comprados' && (
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => verFacturacion(item.idProducto)}
                >
                  Ver Facturación
                </Button>
              )}
            </td>

          </tr>
        ))}
      </tbody>
    </Table>
  );

  const confirmarCompra = async (productoId) => {
    try {
      // Tomar todos los activos actuales desde el estado
      const productosActivos = carrito.activos.map(p => ({
        productoId: p.idProducto,
        cantidad: p.cantidad_solicitada,
        precio: p.precio_original,
        descuento: p.descuento_original
      }));

      await apiFetch('/api/carrito/comprar', {
        method: 'PUT',
        body: JSON.stringify({
          usuarioId: user._id,
          productos: productosActivos
        }),
      });

      const res = await apiFetch(`/api/carrito/${user._id}`);
      const productos = res.productos || [];

      setCarrito({
        activos: productos.filter(p => p.estado === 1),
        reservados: productos.filter(p => p.estado === 2),
        comprados: productos.filter(p => p.estado === 3),
      });
    } catch (err) {
      console.error("Error al confirmar compra:", err);
    }
  };

  const modificarEstado = async (productoId, nuevoEstado) => {
    await apiFetch(
      nuevoEstado === 2 ? '/api/carrito/reservar' : '/api/carrito/cantidad',
      {
        method: 'PUT',
        body: JSON.stringify({
          usuarioId: user._id,
          productoId,
        }),
      }
    );

    const res = await apiFetch(`/api/carrito/${user._id}`);
    const productos = res.productos || [];

    setCarrito({
      activos: productos.filter(p => p.estado === 1),
      reservados: productos.filter(p => p.estado === 2),
      comprados: productos.filter(p => p.estado === 3),
    });
  };

  const eliminar = async (id) => {
    await apiFetch('/api/carrito', {
      method: 'DELETE',
      body: JSON.stringify({
        usuarioId: user._id,
        productoId: id
      }),
    });
    // Actualizar el carrito después de eliminar
    const res = await apiFetch(`/api/carrito/${user._id}`);
    const productos = res.productos || [];

    setCarrito({
      activos: productos.filter(p => p.estado === 1),
      reservados: productos.filter(p => p.estado === 2),
      comprados: productos.filter(p => p.estado === 3),
    });
  };

  const verFacturacion = (productoId) => {
    alert(`Simulando vista de facturación para producto: ${productoId}`);
    // futuro: abrir PDF, redirigir, o mostrar modal con detalle
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
