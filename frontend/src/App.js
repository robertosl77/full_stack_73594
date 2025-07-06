import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ProductosEstructura from "./pages/ProductosEstructura"
import Login from "./login/Login"
import Nosotros from "./pages/Nosotros"
import Contacto from "./pages/Contacto"
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const basedir = process.env.REACT_APP_BASEDIR;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = jwtDecode(token);
        const now = Date.now() / 1000; // en segundos
        if (userData.exp && userData.exp < now) {
          console.warn("Token expirado");
          localStorage.removeItem("token");
        } else {
          setUser(userData);
        }
      } catch (err) {
        console.error("Token inválido:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, [basedir]);

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
    <Router>
      <Routes>
        {/* Redirige la raíz al login con basedir */}
        <Route path="/" element={<Navigate to={`${basedir}/login`} />} />
        
        {/* Rutas con el basedir */}
        <Route path={`${basedir}/login`} element={user ? <Navigate to={`${basedir}/productos`} /> : <Login />} />
        <Route path={`${basedir}/productos`} element={user ? <ProductosEstructura user={user} basedir={basedir} /> : <Navigate to={`${basedir}/login`} />} />
        <Route path={`${basedir}/nosotros`} element={user ? <Nosotros user={user} basedir={basedir} /> : <Navigate to={`${basedir}/login`} />} />
        <Route path={`${basedir}/contacto`} element={user ? <Contacto user={user} basedir={basedir} /> : <Navigate to={`${basedir}/login`} />} />
      </Routes>
    </Router>
  )
}

export default App
