"use client"

import { useState } from "react"

const Login = ({ basedir = "/integrador3" }) => {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${basedir}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      })

      if (res.ok) {
        window.location.href = `${basedir}/productos`
      } else {
        const data = await res.json()
        setError(data.error || "Usuario o contraseña incorrectos")
        setTimeout(() => setError(""), 3000)
      }
    } catch (error) {
      console.error("Error en login:", error)
      setError("Error de conexión")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Implementar Firebase Google Auth aquí
    console.log("Google login")
  }

  return (
    <html lang="es" data-bs-theme="auto">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Signin Template · Bootstrap v5.3</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        <link href="/css/sign-in.css" rel="stylesheet" />
      </head>

      <body className="d-flex align-items-center py-4 bg-body-tertiary">
        <main className="form-signin w-100 m-auto">
          <form onSubmit={handleSubmit}>
            <img className="mb-4" src="/img_logo/educacionit_logo.jpeg" alt="" width="100" />
            <h1 className="h3 mb-3 fw-normal">Proyecto: Integrador3</h1>

            <div className="form-floating">
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

            <div className="form-floating">
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

            <p className="mt-5 mb-3 text-body-secondary">
              &copy; 2025 - Integrador3 - Desarrollado por robertosl77@gmail.com
            </p>
          </form>
        </main>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}

export default Login
