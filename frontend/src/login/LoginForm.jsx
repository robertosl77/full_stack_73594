import { useState } from "react";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8081/integrador3/api/loginForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
        credentials: "include",
      });

      const resData = await res.json();
      
      // 🔐 Limpieza de seguridad
      localStorage.removeItem("token");

      if (resData.success) {
        localStorage.setItem("token", resData.token);
        window.location.href = resData.redirect;
      } else {
        setError("Login fallido: " + resData.error);
      }
    } catch (err) {
      setError("Error de conexión con backend");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          name="usuario"
          id="usuario"
          placeholder="Usuario"
          autoComplete="username"
          required
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <label htmlFor="usuario">Usuario</label>
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          name="password"
          id="floatingPassword"
          placeholder="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <style>{`
        .btn-teal {
          background-color: #20c997;
          border-color: #1cb386;
          color: white;
        }
        .btn-teal:hover {
          background-color: #1cb386;
          border-color: #199d76;
        }
      `}</style>

      <button className="btn btn-teal w-100 py-2 mt-3" type="submit">Ingreso</button>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default LoginForm;
