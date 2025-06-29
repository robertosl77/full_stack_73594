import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts y páginas
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Mensajes from './pages/Mensajes';
import AltaProducto from './pages/AltaProducto';
import GestionProductos from './pages/GestionProductos';

// Futuro hook para sesión
// import useAuth from './hooks/useAuth';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />

        <main className="flex-grow-1 container mt-4 pt-5">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/mensajes" element={<Mensajes />} />
            <Route path="/alta" element={<AltaProducto />} />
            <Route path="/admin/abm" element={<GestionProductos />} />
            {/* Agregamos más rutas a medida que migramos */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
