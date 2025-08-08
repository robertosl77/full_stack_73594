"use client"

import { useEffect, useState } from "react"
import { Modal, Button, Tab, Nav, Table, Card, Dropdown } from "react-bootstrap" // Importar Dropdown
import { apiFetch } from "../utils/apiFetch"
import CantidadSelector from "../components/CantidadSelector"

// Componente para renderizar cada producto como una tarjeta en pantallas pequeñas
function ProductCard({ item, estado, confirmarCompra, modificarEstado, eliminar, verFacturacion }) {
  return (
    <Card className="mb-3 product-card">
      <Card.Body>
        <Card.Title className="product-card-title">{item.nombre}</Card.Title>
        <div className="product-card-details">
          <p><strong>Cantidad:</strong> {item.cantidad_solicitada}</p>
          <p><strong>Stock actual:</strong> {item.stock_actual}</p>
          <p><strong>Precio:</strong> ${item.precio_original}</p>
          <p><strong>Total:</strong> ${(item.precio_original * item.cantidad_solicitada).toFixed(2)}</p>

          {estado === "comprados" && (
            <p><strong>Fecha compra:</strong> {item.fecha_eliminado ? new Date(item.fecha_eliminado).toLocaleString("es-AR") : "-"}</p>
          )}

          {item.cantidad_solicitada > item.stock_actual && (
            <p className="text-danger fw-bold mt-1">
              Stock insuficiente
            </p>
          )}
        </div>

        <div className="product-card-actions">
          <Dropdown className="w-100">
            <Dropdown.Toggle variant="primary" id={`dropdown-actions-${item.idProducto}`} className="w-100">
              Acciones
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              {estado === "activos" && (
                <>
                  <Dropdown.Item
                    onClick={() => confirmarCompra(item.idProducto)}
                    disabled={item.cantidad_solicitada > item.stock_actual}
                  >
                    Comprar
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => modificarEstado(item.idProducto, 2)}
                  >
                    Reservar
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => eliminar(item.idProducto, item.cantidad_solicitada)}
                  >
                    Eliminar
                  </Dropdown.Item>
                </>
              )}
              {estado === "reservados" && (
                <>
                  {/* <Dropdown.Item onClick={() => confirmarCompra(item.idProducto)}>Comprar</Dropdown.Item> */}
                  <Dropdown.Item onClick={() => modificarEstado(item.idProducto, 1)}>
                    Pasar a En Carrito
                  </Dropdown.Item>                  
                  <Dropdown.Item onClick={() => eliminar(item.idProducto, item.cantidad_solicitada)}>
                    Eliminar
                  </Dropdown.Item>
                </>
              )}
              {estado === "comprados" && (
                <Dropdown.Item onClick={() => verFacturacion(item.idProducto)}>Ver Facturación</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Body>
    </Card>
  )
}

function ModalCarrito({ show, onHide, user, actualizarStock, setCantidadCarrito }) {
  const [key, setKey] = useState("activos")
  const [carrito, setCarrito] = useState({
    activos: [],
    reservados: [],
    comprados: [],
  })
  const [isMobile, setIsMobile] = useState(false) // Estado para detectar móvil

  useEffect(() => {
    const handleResize = () => {
      // Consideramos móvil si el ancho de la ventana es menor a 1200px (breakpoint xl de Bootstrap)
      setIsMobile(window.innerWidth < 1200)
    }

    // Establecer el estado inicial
    handleResize()

    // Añadir el event listener
    window.addEventListener("resize", handleResize)

    // Limpiar el event listener al desmontar el componente
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const res = await apiFetch(`/api/carrito/${user._id}`, { method: "GET" })
        const productos = res.productos || []
        setCarrito({
          activos: productos.filter((p) => p.estado === 1),
          reservados: productos.filter((p) => p.estado === 2),
          comprados: productos.filter((p) => p.estado === 3),
        })
        const cantidadProductos = productos.filter((p) => p.estado === 1 || p.estado === 2).length
        setCantidadCarrito(cantidadProductos)
      } catch (err) {
        console.error("Error al cargar carrito", err)
      }
    }
    if (show) cargarCarrito()
  }, [show, user, setCantidadCarrito])

  const confirmarCompra = async (productoId) => {
    try {
      let productosParaComprar = [];

      if (productoId) {
        const p = carrito.activos.find((p) => p.idProducto === productoId);
        if (!p) return;
        productosParaComprar.push({
          productoId: p.idProducto,
          cantidad: p.cantidad_solicitada,
          precio: p.precio_original,
          descuento: p.descuento_original,
        });
      } else {
        productosParaComprar = carrito.activos.map((p) => ({
          productoId: p.idProducto,
          cantidad: p.cantidad_solicitada,
          precio: p.precio_original,
          descuento: p.descuento_original,
        }));
      }

      // 1) Acción de dirección (pendiente)
      // TODO: solicitar dirección antes de pagar

      // 2) Generar URL de pago con Mercado Pago
      const mpRes = await apiFetch("/api/carrito/comprar/mercadopago", {
        method: "POST",
        body: JSON.stringify({
          usuarioId: user._id,
          productos: productosParaComprar,
        }),
      });

      if (!mpRes.success) {
        alert("Error al generar pago: " + (mpRes.error || "Desconocido"));
        return;
      }

      // Redirigir al pago
      window.location.href = mpRes.init_point;

      // 3) Confirmar compra (estado 3)
      await apiFetch("/api/carrito/comprar", {
        method: "PUT",
        body: JSON.stringify({
          usuarioId: user._id,
          productos: productosParaComprar,
        }),
      });

      await refrescarCarrito();
    } catch (err) {
      console.error("Error al confirmar compra:", err);
    }
  };

  const modificarEstado = async (productoId, nuevoEstado) => {
    try {
      let endpoint = "";
      if (nuevoEstado === 2) endpoint = "/api/carrito/reservar";
      else if (nuevoEstado === 1) endpoint = "/api/carrito/activar";

      await apiFetch(endpoint, {      
        method: "PUT",
        body: JSON.stringify({
          usuarioId: user._id,
          productoId,
        }),
      })
      const res = await apiFetch(`/api/carrito/${user._id}`)
      const productos = res.productos || []
      setCarrito({
        activos: productos.filter((p) => p.estado === 1),
        reservados: productos.filter((p) => p.estado === 2),
        comprados: productos.filter((p) => p.estado === 3),
      })
      const cantidadProductos = productos.filter((p) => p.estado === 1 || p.estado === 2).length
      setCantidadCarrito(cantidadProductos)
    } catch (err) {
      console.error("Error al modificar estado:", err)
    }
  }

  const eliminar = async (productoId, cantidad) => {
    try {
      const res = await apiFetch("/api/carrito", {
        method: "DELETE",
        body: JSON.stringify({
          usuarioId: user._id,
          productoId,
        }),
      })
      const data = await res
      if (data.stockActual !== undefined) {
        actualizarStock(productoId, data.stockActual)
      }
      const resCarrito = await apiFetch(`/api/carrito/${user._id}`)
      const productos = resCarrito.productos || []
      setCarrito({
        activos: productos.filter((p) => p.estado === 1),
        reservados: productos.filter((p) => p.estado === 2),
        comprados: productos.filter((p) => p.estado === 3),
      })
      const cantidadProductos = productos.filter((p) => p.estado === 1 || p.estado === 2).length
      setCantidadCarrito(cantidadProductos)
    } catch (err) {
      console.error("Error al eliminar producto del carrito:", err)
    }
  }

  const verFacturacion = (productoId) => {
    alert(`Simulando vista de facturación para producto: ${productoId}`)
  }

  const renderContent = (items, estado) => {
    if (isMobile) {
      return (
        <div className="product-cards-container">
          {items.length > 0 ? (
            items.map((item, i) => (
              <ProductCard
                key={i}
                item={item}
                estado={estado}
                confirmarCompra={confirmarCompra}
                modificarEstado={modificarEstado}
                eliminar={eliminar}
                verFacturacion={verFacturacion}
              />
            ))
          ) : (
            <p className="text-center text-muted">No hay productos en esta sección.</p>
          )}
        </div>
      )
    } else {
      return (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Producto</th>
              {estado !== "comprados" && <th>Stock</th>}
              <th>Cantidad</th>
              {estado === "comprados" && <th>Fecha compra</th>}
              <th>Precio</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, i) => (
                <tr key={i}>
                  <td>{item.nombre}</td>
                  {estado !== "comprados" && (
                  <td>
                    {item.stock_actual}
                    {item.cantidad_solicitada > item.stock_actual && (
                      <span className="ms-2 badge bg-danger">¡Insuficiente!</span>
                    )}
                  </td>
                  )}
                  <td className="text-end">
                    {estado === "activos" ? (
                      <CantidadSelector
                        cantidad={item.cantidad_solicitada}
                        stock={item.stock_actual}
                        productoId={item.idProducto}
                        usuarioId={user._id}
                        onCambio={refrescarCarrito}
                      />
                    ) : (
                      item.cantidad_solicitada
                    )}
                  </td>       
                  {estado === "comprados" && (
                    <td>{item.fecha_eliminado ? new Date(item.fecha_eliminado).toLocaleString("es-AR") : "-"}</td>
                  )}                      
                  <td>${item.precio_original.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                  <td>${(item.precio_original * item.cantidad_solicitada).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                  <td>
                    {estado === "activos" && (
                      <>
                        <Button
                          name="btnComprar"
                          size="sm"
                          variant="success"
                          onClick={() => confirmarCompra(item.idProducto)}
                          className="me-2"
                          disabled={item.cantidad_solicitada > item.stock_actual}
                        >
                          Comprar
                        </Button>

                        <Button
                          name="btnReservar"
                          size="sm"
                          variant="warning"
                          onClick={() => modificarEstado(item.idProducto, 2)}
                          className="me-2"
                        >
                          Reservar
                        </Button>

                        <Button
                          name="btnEliminar"
                          size="sm"
                          variant="danger"
                          onClick={() => eliminar(item.idProducto, item.cantidad_solicitada)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                    {estado === "reservados" && (
                      <>
                        {/* <Button
                          name="btnComprar"
                          size="sm"
                          variant="success"
                          onClick={() => confirmarCompra(item.idProducto)}
                          className="me-2"
                        >
                          Comprar
                        </Button> */}
                        <Button
                          name="btnActivar"
                          size="sm"
                          variant="warning"
                          onClick={() => modificarEstado(item.idProducto, 1)}
                          className="me-2"
                        >
                          Pasar a En Carrito
                        </Button>                       
                        <Button
                          name="btnEliminar"
                          size="sm"
                          variant="danger"
                          onClick={() => eliminar(item.idProducto, item.cantidad_solicitada)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                    {estado === "comprados" && (
                      <Button 
                        name="btnVerFacturacion"
                        size="sm" 
                        variant="info" 
                        onClick={() => verFacturacion(item.idProducto)}
                      >
                        Ver Facturación
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No hay productos en esta sección.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )
    }
  }

  const refrescarCarrito = async () => {
    try {
      const res = await apiFetch(`/api/carrito/${user._id}`)
      const productos = res.productos || []
      setCarrito({
        activos: productos.filter((p) => p.estado === 1),
        reservados: productos.filter((p) => p.estado === 2),
        comprados: productos.filter((p) => p.estado === 3),
      })
      const cantidadProductos = productos.filter((p) => p.estado === 1 || p.estado === 2).length
      setCantidadCarrito(cantidadProductos)
    } catch (err) {
      console.error("Error al refrescar carrito", err)
    }
  }

  const totalActivos = carrito.activos.reduce(
    (acc, item) => acc + item.precio_original * item.cantidad_solicitada,
    0
  )  

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Carrito de Compras</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
          <div className={`d-flex flex-wrap align-items-start ${isMobile ? "flex-column" : "justify-content-between"}`}>
            <div className="d-flex">
              <Nav variant="tabs" className={isMobile ? "w-100 mb-2" : ""}>
                <Nav.Item>
                  <Nav.Link eventKey="activos">En Carrito</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reservados">Reservados</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="comprados">Comprados</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            {key === "activos" && (
              <div className="d-flex align-items-center ms-auto gap-3">
                <div className="text-end pe-2">
                  <div className="text-muted" style={{ fontSize: "0.75rem", lineHeight: "1" }}>Total a pagar</div>
                  <div className="fw-bold text-success" style={{ fontSize: "1.1rem" }}>
                    ${totalActivos.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <Button
                  name="btnComprarTodo"
                  variant="success"
                  className="fw-bold text-white px-3 py-1 rounded text-uppercase border-2 shadow-sm"
                  style={{ fontSize: "0.9rem", height: "38px", lineHeight: "1", display: "flex", alignItems: "center" }}
                  onClick={() => confirmarCompra()}
                  disabled={carrito.activos.length === 0 || carrito.activos.some(p => p.cantidad_solicitada > p.stock_actual)}
                >
                  🛒 Comprar todo
                </Button>
              </div>
            )}

          </div>
          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="activos">{renderContent(carrito.activos, "activos")}</Tab.Pane>
            <Tab.Pane eventKey="reservados">{renderContent(carrito.reservados, "reservados")}</Tab.Pane>
            <Tab.Pane eventKey="comprados">{renderContent(carrito.comprados, "comprados")}</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          name="btnCerrar"
          variant="secondary" 
          onClick={onHide}
        >
            Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCarrito
