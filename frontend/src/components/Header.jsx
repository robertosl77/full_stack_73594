import { useState, useEffect, useCallback } from "react";
import { logout } from "../login/Logout";

const Header = ({ user, basedir = "/integrador3" }) => {
  const [cartCount, setCartCount] = useState(0)
  const [showCart, setShowCart] = useState(false)

  const updateCartCount = useCallback(async () => {
    try {
      const res = await fetch(`${basedir}/carrito/cantidad`)
      const data = await res.json()
      setCartCount(data.cantidad || 0)
      setShowCart(data.cantidad > 0)
    } catch (error) {
      console.error("Error al actualizar carrito:", error)
    }
  }, [basedir])

  useEffect(() => {
    if (user) {
      updateCartCount()
    }
  }, [user, updateCartCount])

  const isAdmin = user?.rol === "ROLE_ADMINISTRADOR"

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body fixed-top" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href={`${basedir}/productos`}>
            <img src="/img_logo/logo.png" alt="Logo" style={{ height: "40px" }} />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href={`${basedir}/productos`}>Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${basedir}/nosotros`}>Nosotros</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${basedir}/contacto`}>Contactenos</a>
              </li>

              {isAdmin && (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link"
                    id="productosDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                    style={{ textDecoration: "none" }}
                  >
                    Gestiones
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                    <li>
                      <a className="dropdown-item" href={`${basedir}/mensajes`}>Mensajes</a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <a className="dropdown-item" href={`${basedir}/admin/abm`}>Gestión de Productos</a>
                    </li>
                    <li>
                      <a className="dropdown-item" href={`${basedir}/alta`}>Nuevo Producto</a>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            {user && (
              <ul className="navbar-nav">
                <li className="nav-item d-flex align-items-center me-3" style={{ position: "relative" }}>
                  <div id="cart-wrapper" style={{ display: showCart ? "inline-block" : "none" }}>
                    <button
                      type="button"
                      className="nav-link btn btn-link position-relative px-2"
                      data-bs-toggle="modal"
                      data-bs-target="#modalCarrito"
                      style={{ textDecoration: "none" }}
                    >
                      🛒
                      <span
                        id="cart-count"
                        className="position-absolute top-10 start-70 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {cartCount}
                      </span>
                    </button>
                  </div>
                </li>

                <li className="nav-item">
                  <span className="nav-link disabled">
                    Hola, {user.nombre} {user.apellido}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    style={{ textDecoration: "none" }}
                    onClick={logout}
                    type="button"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
