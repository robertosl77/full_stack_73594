import { Table, Button } from "react-bootstrap"
import CantidadSelector from "../components/CantidadSelector"

const precioConDescuento = (item) => {
  const d = Number(item?.descuento_original || 0)
  const base = Number(item?.precio_original || 0)
  return Number((((100 - d) / 100) * base).toFixed(2))
}

function ModalCarritoTabla({ items, estado, iniciarPagoMercadoPago, modificarEstado, eliminar, verFacturacion, usuarioId, onCambio }) {
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
          items.map((item, i) => {
            const precio_final =
              estado === "activos" || estado === "reservados"
                ? precioConDescuento(item)
                : Number(item?.precio_original || 0)
            const total_final = precio_final * Number(item?.cantidad_solicitada || 0)

            return (
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
                      usuarioId={usuarioId}
                      onCambio={onCambio}
                    />
                  ) : (
                    item.cantidad_solicitada
                  )}
                </td>
                {estado === "comprados" && (
                  <td>{item.fecha_eliminado ? new Date(item.fecha_eliminado).toLocaleString("es-AR") : "-"}</td>
                )}
                <td>
                  ${precio_final.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  {(estado === "activos" || estado === "reservados") && item.descuento_original > 0 && (
                    <small className="text-muted">(-{item.descuento_original}%)</small>
                  )}
                </td>
                <td>
                  ${total_final.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </td>
                <td>
                  {estado === "activos" && (
                    <>
                      <Button
                        name="btnComprar"
                        size="sm"
                        variant="success"
                        onClick={() => iniciarPagoMercadoPago(item.idProducto)}
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
                      <Button
                        name="btnActivar"
                        size=" smear-2"
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
            )
          })
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

export default ModalCarritoTabla