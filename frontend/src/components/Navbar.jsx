// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../login/Logout";
import { apiFetch } from "../utils/apiFetch";
import { getBasedirFromToken } from "../utils/tokenUtils";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

function Navbar({ user }) {
  const location = useLocation();
  const basedir = getBasedirFromToken();

  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);

  const updateCartCount = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/carrito/cantidad`, { method: "GET" });
      const resData = await res;
      setCartCount(resData.cantidad || 0);
      setShowCart(resData.cantidad > 0);
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
    }
  }, []);

  const cerrarMenu = () => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      new bootstrap.Collapse(navbar).hide();
    }
  };  

  useEffect(() => {
    if (user) updateCartCount();
  }, [user, updateCartCount]);

  const isAdmin = user?.rol === "ROLE_ADMINISTRADOR";

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body fixed-top" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to={`${basedir}/productos`}>
          <img src="/img_logo/logo.png" alt="Logo" style={{ height: "40px" }} />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === `${basedir}/productos` ? 'active' : ''}`} to={`${basedir}/productos`} onClick={cerrarMenu}>Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === `${basedir}/nosotros` ? 'active' : ''}`} to={`${basedir}/nosotros`} onClick={cerrarMenu}>Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === `${basedir}/contacto` ? 'active' : ''}`} to={`${basedir}/contacto`} onClick={cerrarMenu}>Contactenos</Link>
            </li>

            {isAdmin && (
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link" id="productosDropdown" data-bs-toggle="dropdown" type="button" style={{ textDecoration: "none" }} onClick={cerrarMenu}>
                  Gestiones
                </button>
                <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                  <li>
                    <Link className="dropdown-item" to={`${basedir}/mensajes`} onClick={cerrarMenu}>Mensajes</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to={`${basedir}/admin/abm`} onClick={cerrarMenu}>Gestión de Productos</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`${basedir}/alta`} onClick={cerrarMenu}>Nuevo Producto</Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {user && (
            <ul className="navbar-nav">
              <li className="nav-item d-flex align-items-center me-3" style={{ position: "relative" }}>
                {showCart && (
                  <button type="button" className="nav-link btn btn-link position-relative px-2" data-bs-toggle="modal" data-bs-target="#modalCarrito" style={{ textDecoration: "none" }}>
                    🛒
                    <span className="position-absolute top-10 start-70 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.7rem" }}>
                      {cartCount}
                    </span>
                  </button>
                )}
              </li>
              <li className="nav-item">
                <span className="nav-link disabled">
                  Hola, {user.nombre} {user.apellido}
                </span>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" style={{ textDecoration: "none" }} onClick={logout} type="button">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
