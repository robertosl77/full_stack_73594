import { useState } from "react";

const LoginInvitado = () => {
  const basedir = process.env.REACT_APP_BASEDIR;
  const url = process.env.REACT_APP_URL;

  const [error, setError] = useState("");

  const handleLoginInvitado = async () => {
    const datos = {
      proveedor: "demo",
      usuario: "demo_user",
      email: "invitado@demo.com",
      nombre: "Invitado",
      apellido: "Demo",
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
          Ingresar como Invitado
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
