"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Productos from "./pages/Productos"
import Login from "./login/Login"
import Nosotros from "./pages/Nosotros"
import Contacto from "./pages/Contacto"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const basedir = "/integrador3"

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch(`${basedir}/api/auth/me`)
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
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
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/productos" /> : <Login basedir={basedir} />} />
        <Route
          path="/productos"
          element={user ? <Productos user={user} basedir={basedir} /> : <Navigate to="/login" />}
        />
        <Route
          path="/nosotros"
          element={user ? <Nosotros user={user} basedir={basedir} /> : <Navigate to="/login" />}
        />
        <Route
          path="/contacto"
          element={user ? <Contacto user={user} basedir={basedir} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/productos" />} />
      </Routes>
    </Router>
  )
}

export default App
