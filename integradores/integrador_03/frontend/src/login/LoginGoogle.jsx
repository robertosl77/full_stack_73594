// src/login/LoginGoogle.jsx
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase";

const LoginGoogle = () => {
  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const datos = {
        proveedor: user.providerData[0]?.providerId || "google.com",
        idSocial: user.providerData[0]?.uid || "",
        email: user.email,
        nombre: user.displayName?.split(" ")[0] || "",
        apellido: user.displayName?.split(" ")[1] || "",
      };

      const res = await fetch("/integrador3/loginFirebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const json = await res.json();
      if (json.success) {
        window.location.href = json.redirect;
      } else {
        alert("Falló el login: " + json.error);
      }
    } catch (err) {
      console.error("Error con login de Google", err);
      alert("Fallo al iniciar sesión con Google.");
    }
  };

  return (
    <button className="btn btn-danger w-100" onClick={handleGoogleLogin}>
      Iniciar sesión con Google
    </button>
  );
};

export default LoginGoogle;
