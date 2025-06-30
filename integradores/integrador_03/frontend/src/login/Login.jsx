"use client"

import { useState } from "react"
import axios from "axios"

const Login = () => {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const basedir = process.env.REACT_APP_BASEDIR || "/integrador3"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`http://localhost:8081${basedir}/login`, { usuario, password })
      if (res.status === 200) {
        window.location.href = `${basedir}/productos`
      }
    } catch (err) {
      setError(err.response?.data?.error || "Usuario o contraseña incorrectos")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log("Google login (pendiente integración Firebase)")
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-body-tertiary">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          <img className="mb-4" src="/img_logo/educacionit_logo.jpeg" alt="logo" width="100" />
          <h1 className="h3 mb-3 fw-normal">Proyecto: integrador3</h1>

          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="usuario"
              placeholder="Usuario"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
            <label htmlFor="usuario">Usuario</label>
          </div>

          <div className="form-floating mb-2">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingreso"}
          </button>

          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}

          <div className="mt-2">
            <button type="button" className="btn btn-danger w-100" onClick={handleGoogleLogin}>
              Iniciar sesión con Google
            </button>
          </div>

          <p className="mt-5 mb-3 text-body-secondary text-center">
            &copy; 2025 - integrador3 - robertosl77@gmail.com
          </p>
        </form>
      </main>
    </div>
  )
}

export default Login
