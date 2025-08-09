import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductosEstructura from "./pages/ProductosEstructura";
import Login from "./login/Login";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Mensajes from "./pages/Mensajes";
import AltaProductos from "./pages/AltaProductos";
import AbmProductos from "./pages/AbmProductos";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ModalCarrito from "./modales/ModalCarrito";
import { apiFetch } from "./utils/apiFetch";
import PingSpinner from './components/PingSpinner';
import { esVista } from "./utils/tokenUtils";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [showModalCarrito, setShowModalCarrito] = useState(false);
  const [productos, setProductos] = useState([]);
  const basedir = process.env.REACT_APP_BASEDIR;

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f9fa";
    document.body.style.backgroundImage = "url('https://www.transparenttextures.com/patterns/wine-cork.png')";
  }, []);

  useEffect(() => {
    const obtenerCantidadCarrito = async () => {
      if (esVista()) return; // No cargar cantidad si es vista

      try {
        const res = await apiFetch(`/api/carrito/cantidad`);
        const resData = await res;
        if (typeof resData.cantidad === "number") {
          setCantidadCarrito(resData.cantidad);
        }
      } catch (error) {
        console.error("Error al obtener cantidad del carrito:", error);
      }
    };
  
    if (user) {
      obtenerCantidadCarrito();
    }
  }, [user]);  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = jwtDecode(token);
        const now = Date.now() / 1000;
        if (userData.exp && userData.exp < now) {
          console.warn("Token expirado");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          setUser(userData);
        }
      } catch (err) {
        console.error("Token inválido:", err);
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    setLoading(false);
  }, [basedir]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await apiFetch(`/api/productos`);
        const resData = await res;
        setProductos(resData.productos || []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    if (user) cargarProductos();
  }, [user, basedir]);

  const actualizarStock = (productoId, nuevoStock) => {
    setProductos((prev) =>
      prev.map((p) => (p._id === productoId ? { ...p, stock: nuevoStock } : p))
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <PingSpinner>
        {user && (
          <Navbar
            user={user}
            cantidadCarrito={cantidadCarrito}
            setShowModalCarrito={setShowModalCarrito}
          />
        )}
        <Routes>
          <Route path="/" element={<Navigate to={`/${basedir}/login`} replace />} />
          <Route path={`/${basedir}/login`} element={user ? <Navigate to={`/${basedir}/productos`} replace /> : <Login />} />
          <Route
            path={`${basedir}/productos`}
            element={
              user ? (
                <ProductosEstructura
                  user={user}
                  basedir={basedir}
                  setCantidadCarrito={setCantidadCarrito}
                  productos={productos}
                  actualizarStock={actualizarStock}
                />
              ) : (
                <Navigate to={`/`} />
              )
            }
          />
          <Route
            path={`${basedir}/nosotros`}
            element={
              user ? (
                <Nosotros user={user} basedir={basedir} />
              ) : (
                <Navigate to={`/`} />
              )
            }
          />
          <Route
            path={`${basedir}/contacto`}
            element={
              user ? (
                <Contacto user={user} basedir={basedir} />
              ) : (
                <Navigate to={`/`} />
              )
            }
          />
          <Route
            path={`${basedir}/admin/mensajes`}
            element={
              user ? (
                <Mensajes user={user} basedir={basedir} />
              ) : (
                <Navigate to={`/`} />
              )
            }
          />
          <Route
            path={`${basedir}/admin/alta`}
            element={
              user ? (
                <AltaProductos user={user} basedir={basedir} />
              ) : (
                <Navigate to={`/`} />
              )
            }
          />
          <Route
            path={`${basedir}/admin/abm`}
            element={
              user ? (
                <AbmProductos user={user} basedir={basedir} />
              ) : (
                <Navigate to={`/`} />
              )
            }
          />
        </Routes>
        {user && (
          <ModalCarrito
            show={showModalCarrito}
            onHide={() => setShowModalCarrito(false)}
            user={user}
            actualizarStock={actualizarStock}
            setCantidadCarrito={setCantidadCarrito}
          />
        )}
        {user && <Footer />}
      </PingSpinner>
    </Router>
  );
}

export default App;