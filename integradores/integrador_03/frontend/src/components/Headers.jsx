import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top shadow">
      <div className="container">
        <Link className="navbar-brand" to="/productos">
          <img src="/img_logo/educacionit_logo.jpeg" alt="Logo" height="32" className="me-2" />
          Integrador2
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/alta">Alta</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/mensajes">Mensajes</Link></li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <Link to="/carrito" className="btn btn-outline-light position-relative" id="cart-wrapper" style={{ display: 'inline-block' }}>
              🛒
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="cart-count">
                0
              </span>
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
