import { useState } from "react";

const LoginAdmin = () => {
  const basedir = process.env.REACT_APP_BASEDIR;
  const url = process.env.REACT_APP_URL;

  const [error, setError] = useState("");

  const handleLoginAdmin = async () => {
    const datos = {
      proveedor: "demo",
      usuario: "demo_user",
      email: "admin@demo.com",
      nombre: "Administrador",
      apellido: "Demo",
    };

    try {
      const res = await fetch(`${url}/${basedir}/api/LoginAdmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
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
    } catch (error) {
      setError("Error de conexión con backend");
    }
  };

  return (
    <>
      <div className="mt-2">
        <button type="button" className="btn btn-secondary w-100" onClick={handleLoginAdmin}>
          Ingresar como Administrador
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </>
  );
};

export default LoginAdmin;
