import { useState } from "react";

const LoginInvitado = ({ rol, caption }) => {
  const basedir = process.env.REACT_APP_BASEDIR;
  const url = process.env.REACT_APP_URL;

  const [error, setError] = useState("");

  const handleLoginInvitado = async () => {
    const nombre= rol === "ROLE_ADMINISTRADOR" ? "Administrador" : rol === "ROLE_CLIENTE" ? "Cliente" : "Invitado";

    const datos = {
      proveedor: "demo",
      usuario: "demo_user",
      email: "admin@demo.com",
      nombre: nombre,
      apellido: "Demo",
      rol: rol,
    };

    try {
      const res = await fetch(`${url}/${basedir}/api/loginInvitado`, {
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
        <button type="button" className="btn btn-secondary w-100" onClick={handleLoginInvitado}>
          {caption}
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

export default LoginInvitado;
