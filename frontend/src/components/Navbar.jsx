import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">integrador3</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/productos' ? 'active' : ''}`}
                to="/productos"
              >
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/alta' ? 'active' : ''}`}
                to="/alta"
              >
                Alta Producto
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/nosotros' ? 'active' : ''}`}
                to="/nosotros"
              >
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/contacto' ? 'active' : ''}`}
                to="/contacto"
              >
                Contacto
              </Link>
            </li>
          </ul>
          <Link to="/login" className="btn btn-outline-light">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
