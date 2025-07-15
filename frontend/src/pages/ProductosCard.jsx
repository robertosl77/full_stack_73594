import React from "react";

const ProductosCard = ({ producto, onAgregar, esVista }) => {
  const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const validarCantidad = (productoId, cantidad, max) => {
    const errorDiv = document.querySelector(`#error-stock-${productoId}`);
    if (cantidad < 1 || cantidad > max) {
      if (errorDiv) {
        errorDiv.textContent = `La cantidad debe estar entre 1 y ${max}.`;
        errorDiv.style.display = "block";
        setTimeout(() => (errorDiv.style.display = "none"), 3000);
      }
      return false;
    }
    if (errorDiv) errorDiv.style.display = "none";
    return true;
  };

  const handleAgregar = () => {
    const input = document.querySelector(`#cantidad${producto._id}`);
    const cantidad = parseInt(input?.value || "1", 10);
    if (validarCantidad(producto._id, cantidad, producto.stock)) {
      onAgregar(producto._id, cantidad);
    }
  };

  return (
    <div className="card h-100 rounded-3 p-3 text-center shadow position-relative">
      {producto.descuento > 0 && (
        <div className="descuento position-absolute bg-warning rounded-2 text-black fw-bold fs-6 px-2 py-1">
          {producto.descuento}% OFF
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px", overflow: "hidden" }}>
        <img
          src={`/${producto.imagen}`}
          alt={titleCase(producto.nombre)}
          className="img-fluid"
          style={{ objectFit: "cover", maxHeight: "100%" }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-0">{titleCase(producto.nombre)}</h5>
        <p className="text-secondary fs-6 mb-0">{titleCase(producto.bodega)}</p>
        <p className="mb-0">{titleCase(producto.tipo)}</p>

        <p className="fw-bold fs-5 mb-1">
          {producto.descuento > 0 ? (
            <>
              <small className="text-decoration-line-through text-danger" style={{ fontSize: "0.75rem" }}>
                ${producto.precioOriginalFormateado}
              </small>
              <br />${producto.precioDescuento}
            </>
          ) : (
            `$${producto.precioOriginalFormateado}`
          )}
        </p>

        <p className="text-success fs-6">Disponibles: {producto.stock}</p>

        {!esVista && (
          <>
            <div className="mb-2">
              <label htmlFor={`cantidad${producto._id}`}>Cantidad:</label>
              <input
                type="number"
                id={`cantidad${producto._id}`}
                min="1"
                max={producto.stock}
                defaultValue="1"
                disabled={producto.stock === 0}
              />
            </div>

            <div className="text-danger small mb-2" id={`error-stock-${producto._id}`} style={{ display: "none" }}></div>

            <button
              className={`btn w-100 mt-auto ${producto.stock > 0 ? "btn-primary" : "btn-secondary"}`}
              disabled={producto.stock === 0}
              style={producto.stock === 0 ? { background: "gray", cursor: "not-allowed" } : {}}
              onClick={handleAgregar}
            >
              {producto.stock > 0 ? "AGREGAR" : "Sin stock"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductosCard;
