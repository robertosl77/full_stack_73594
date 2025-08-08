"use client"

import { useEffect, useState } from "react"
import { Modal, Button, Tab, Nav } from "react-bootstrap"
import { apiFetch } from "../utils/apiFetch"
import ModalCarritoCards from "./ModalCarritoCards"
import ModalCarritoTabla from "./ModalCarritoTabla"

function ModalCarrito({ show, onHide, user, actualizarStock, setCantidadCarrito }) {
  const [key, setKey] = useState("activos")
  const [carrito, setCarrito] = useState({
    activos: [],
    reservados: [],
    comprados: [],
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
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

  const precioConDescuento = (item) => {
    const d = Number(item?.descuento_original || 0)
    const base = Number(item?.precio_original || 0)
    return Number((((100 - d) / 100) * base).toFixed(2))
  }

  const confirmarCompra = async (productoId) => {
    try {
      let productosParaComprar = []

      if (productoId) {
        const p = carrito.activos.find((p) => p.idProducto === productoId)
        if (!p) return
        productosParaComprar.push({
          productoId: p.idProducto,
          cantidad: p.cantidad_solicitada,
          precio: p.precio_original,
          descuento: p.descuento_original,
        })
      } else {
        productosParaComprar = carrito.activos.map((p) => ({
          productoId: p.idProducto,
          cantidad: p.cantidad_solicitada,
          precio: p.precio_original,
          descuento: p.descuento_original,
        }))
      }

      const mpRes = await apiFetch("/api/carrito/comprar/mercadopago", {
        method: "POST",
        body: JSON.stringify({
          usuarioId: user._id,
          productos: productosParaComprar,
        }),
      })

      if (!mpRes.success) {
        alert("Error al generar pago: " + (mpRes.error || "Desconocido"))
        return
      }

      window.location.href = mpRes.init_point

      await apiFetch("/api/carrito/comprar", {
        method: "PUT",
        body: JSON.stringify({
          usuarioId: user._id,
          productos: productosParaComprar,
        }),
      })

      await refrescarCarrito()
    } catch (err) {
      console.error("Error al confirmar compra:", err)
    }
  }

  const modificarEstado = async (productoId, nuevoEstado) => {
    try {
      let endpoint = ""
      if (nuevoEstado === 2) endpoint = "/api/carrito/reservar"
      else if (nuevoEstado === 1) endpoint = "/api/carrito/activar"

      await apiFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify({
          usuarioId: user._id,
          productoId,
        }),
      })
      await refrescarCarrito()
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
      await refrescarCarrito()
    } catch (err) {
      console.error("Error al eliminar producto del carrito:", err)
    }
  }

  const verFacturacion = (productoId) => {
    alert(`Simulando vista de facturación para producto: ${productoId}`)
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
    (acc, item) => acc + precioConDescuento(item) * item.cantidad_solicitada,
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
            <Tab.Pane eventKey="activos">
              {isMobile ? (
                <ModalCarritoCards
                  items={carrito.activos}
                  estado="activos"
                  confirmarCompra={confirmarCompra}
                  modificarEstado={modificarEstado}
                  eliminar={eliminar}
                  verFacturacion={verFacturacion}
                  usuarioId={user._id}
                  onCambio={refrescarCarrito}
                />
              ) : (
                <ModalCarritoTabla
                  items={carrito.activos}
                  estado="activos"
                  confirmarCompra={confirmarCompra}
                  modificarEstado={modificarEstado}
                  eliminar={eliminar}
                  verFacturacion={verFacturacion}
                  usuarioId={user._id}
                  onCambio={refrescarCarrito}
                />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="reservados">
              {isMobile ? (
                <ModalCarritoCards
                  items={carrito.reservados}
                  estado="reservados"
                  confirmarCompra={confirmarCompra}
                  modificarEstado={modificarEstado}
                  eliminar={eliminar}
                  verFacturacion={verFacturacion}
                  usuarioId={user._id}
                  onCambio={refrescarCarrito}
                />
              ) : (
                <ModalCarritoTabla
                  items={carrito.reservados}
                  estado="reservados"
                  confirmarCompra={confirmarCompra}
                  modificarEstado={modificarEstado}
                  eliminar={eliminar}
                  verFacturacion={verFacturacion}
                  usuarioId={user._id}
                  onCambio={refrescarCarrito}
                />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="comprados">
              {isMobile ? (
                <ModalCarritoCards
                  items={carrito.comprados}
                  estado="comprados"
                  confirmarCompra={confirmarCompra}
                  modificarEstado={modificarEstado}
                  eliminar={eliminar}
                  verFacturacion={verFacturacion}
                  usuarioId={user._id}
                  onCambio={refrescarCarrito}
                />
              ) : (
                <ModalCarritoTabla
                  items={carrito.comprados}
                  estado="comprados"
                  confirmarCompra={confirmarCompra}
                  modificarEstado={modificarEstado}
                  eliminar={eliminar}
                  verFacturacion={verFacturacion}
                  usuarioId={user._id}
                  onCambio={refrescarCarrito}
                />
              )}
            </Tab.Pane>
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