// src/login/Login.jsx
import React, { useState } from "react";
import LoginGoogle from "./LoginGoogle";
import LoginGithub from "./LoginGithub";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/integrador2/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error en login clásico:", err);
      alert("Error de red");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>

        <div className="mt-3">
          <LoginGoogle />
          <LoginGithub />
        </div>
      </div>
    </div>
  );
};

export default Login;
