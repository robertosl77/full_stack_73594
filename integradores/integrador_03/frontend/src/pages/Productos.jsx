"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ModalCarrito from "../components/ModalCarrito"

const Productos = ({ user, basedir = "/integrador3" }) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${basedir}/api/productos`)
      const data = await res.json()
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const agregarAlCarrito = async (productoId, cantidad) => {
    if (!user) return

    try {
      const res = await fetch(`${basedir}/carrito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId, cantidad }),
      })

      if (res.ok) {
        // Actualizar contador del carrito
        const cartRes = await fetch(`${basedir}/carrito/cantidad`)
        const cartData = await cartRes.json()

        // Actualizar UI del carrito
        const cartWrapper = document.querySelector("#cart-wrapper")
        const cartCount = document.querySelector("#cart-count")

        if (cartWrapper) cartWrapper.style.display = "inline-block"
        if (cartCount) cartCount.textContent = cartData.cantidad
      }
    } catch (error) {
      console.error("Fallo al agregar al carrito", error)
    }
  }

  const validarCantidad = (productoId, cantidad, max) => {
    const errorDiv = document.querySelector(`#error-stock-${productoId}`)

    if (cantidad < 1 || cantidad > max) {
      if (errorDiv) {
        errorDiv.textContent = `La cantidad debe estar entre 1 y ${max}.`
        errorDiv.style.display = "block"
        setTimeout(() => {
          errorDiv.style.display = "none"
        }, 3000)
      }
      return false
    }

    if (errorDiv) errorDiv.style.display = "none"
    return true
  }

  const titleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const updateCartCount = async () => {
    // Función para actualizar el contador del carrito
    try {
      const res = await fetch(`${basedir}/carrito/cantidad`)
      const data = await res.json()
      const cartWrapper = document.querySelector("#cart-wrapper")
      const cartCount = document.querySelector("#cart-count")

      if (cartWrapper) cartWrapper.style.display = data.cantidad > 0 ? "inline-block" : "none"
      if (cartCount) cartCount.textContent = data.cantidad
    } catch (error) {
      console.error("Error al actualizar carrito:", error)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header user={user} basedir={basedir} />

      <div id="main-content" className="container-fluid pt-5 mt-4">
        <div className="container-sm mt-3">
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-3 mb-3">
            {productos.map((producto) => (
              <div key={producto._id} className="col">
                <div className="card h-100 rounded-3 p-3 text-center shadow position-relative">
                  {producto.descuento > 0 && (
                    <div className="descuento position-absolute bg-warning rounded-2 text-black fw-bold fs-6 px-2 py-1">
                      {producto.descuento}% OFF
                    </div>
                  )}

                  <img src={`/${producto.imagen}`} className="card-img-top" alt={titleCase(producto.nombre)} />

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-0">{titleCase(producto.nombre)}</h5>
                    <p className="card-text text-secondary fs-6 mb-0">{titleCase(producto.bodega)}</p>
                    <p className="mb-0">{titleCase(producto.tipo)}</p>

                    <p className="card-text fw-bold fs-5 mb-1">
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

                    <p className="card-text text-success fs-6">Disponibles: {producto.stock}</p>

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

                    <div
                      className="text-danger small mb-2"
                      id={`error-stock-${producto._id}`}
                      style={{ display: "none" }}
                    ></div>

                    <button
                      className={`btn w-100 mt-auto ${producto.stock > 0 ? "btn-primary btn-agregar-carrito" : "btn-secondary"}`}
                      disabled={producto.stock === 0}
                      style={producto.stock === 0 ? { background: "gray", cursor: "not-allowed" } : {}}
                      onClick={() => {
                        const cantidadInput = document.querySelector(`#cantidad${producto._id}`)
                        const cantidad = Number.parseInt(cantidadInput?.value || "1", 10)

                        if (validarCantidad(producto._id, cantidad, producto.stock)) {
                          agregarAlCarrito(producto._id, cantidad)
                        }
                      }}
                    >
                      {producto.stock > 0 ? "AGREGAR" : "Sin stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalCarrito user={user} basedir={basedir} onUpdateCart={updateCartCount} />
      <Footer />
    </>
  )
}

export default Productos
