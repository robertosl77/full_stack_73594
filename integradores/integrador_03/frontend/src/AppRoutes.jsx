import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Productos from './pages/Productos';
import AltaProducto from './pages/AltaProducto';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Mensajes from './pages/Mensajes';
import Home from './pages/Home';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/alta" element={<AltaProducto />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/mensajes" element={<Mensajes />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
