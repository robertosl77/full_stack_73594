import { useCallback, useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Productos from "./pages/Productos"
import Login from "./login/Login"
import Nosotros from "./pages/Nosotros"
import Contacto from "./pages/Contacto"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const basedir = process.env.REACT_APP_BASEDIR || "/integrador3"

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${basedir}/login`)
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
    }
  }, [basedir])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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
        <Route path={`${basedir}/productos`} element={user ? <Productos user={user} basedir={basedir} /> : <Navigate to={`${basedir}/login`} />} />
        <Route path={`${basedir}/nosotros`} element={user ? <Nosotros user={user} basedir={basedir} /> : <Navigate to={`${basedir}/login`} />} />
        <Route path={`${basedir}/contacto`} element={user ? <Contacto user={user} basedir={basedir} /> : <Navigate to={`${basedir}/login`} />} />
      </Routes>
    </Router>
  )
}

export default App
