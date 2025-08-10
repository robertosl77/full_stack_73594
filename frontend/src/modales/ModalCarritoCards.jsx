import { Card, Dropdown } from "react-bootstrap"
import CantidadSelector from "../components/CantidadSelector"

const precioConDescuento = (item) => {
  const d = Number(item?.descuento_original || 0)
  const base = Number(item?.precio_original || 0)
  return Number((((100 - d) / 100) * base).toFixed(2))
}

function ModalCarritoCards({ items, estado, iniciarPagoMercadoPago, modificarEstado, eliminar, verFacturacion, usuarioId, onCambio }) {
  return (
    <div className="product-cards-container">
      {items.length > 0 ? (
        items.map((item, index) => (
          <Card key={`${estado}-${item.idProducto}-${index}`} className="mb-3 product-card">
            <Card.Body>
              <Card.Title className="product-card-title">{item.nombre}</Card.Title>
              <div className="product-card-details">
                <div className="d-flex align-items-center gap-2">
                  <strong className="mb-0">Cantidad:</strong>
                  {estado === "activos" ? (
                    <div className="w-25">
                        <CantidadSelector
                        className="cantidad-selector-limit"
                        cantidad={item.cantidad_solicitada}
                        stock={item.stock_actual}
                        productoId={item.idProducto}
                        usuarioId={usuarioId}
                        onCambio={onCambio}
                        />
                    </div>
                  ) : (
                    item.cantidad_solicitada
                  )}
                </div>
                <p><strong>Stock actual:</strong> {item.stock_actual}</p>
                <p><strong>Precio:</strong> ${precioConDescuento(item)}</p>
                <p>
                  <strong>Total:</strong> ${(precioConDescuento(item) * item.cantidad_solicitada).toFixed(2)}
                  {item.descuento_original > 0 && (
                    <small className="text-muted">(-{item.descuento_original}% aplicado)</small>
                  )}
                </p>
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
                          onClick={() => iniciarPagoMercadoPago(item.idProducto)}
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
                        <Dropdown.Item onClick={() => modificarEstado(item.idProducto, 1)}>
                          Pasar a En Carrito
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => eliminar(item.idProducto, item.cantidad_solicitada)}>
                          Eliminar
                        </Dropdown.Item>
                      </>
                    )}
                    {estado === "comprados" && (
                      <Dropdown.Item onClick={() => verFacturacion(item.idProducto)}>
                        Ver Facturación
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted">No hay productos en esta sección.</p>
      )}
    </div>
  )
}

export default ModalCarritoCards