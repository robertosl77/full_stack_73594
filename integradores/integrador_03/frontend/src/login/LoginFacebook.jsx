// src/login/LoginFacebook.jsx
import React, { useEffect } from "react";

const LoginFacebook = () => {
  useEffect(() => {
    // Carga SDK de Facebook
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "720584530950391", // ← Reemplazar si cambia
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/es_LA/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          window.FB.api("/me", { fields: "name,email" }, async function (userData) {
            const [nombre, apellido] = userData.name.split(" ");

            const datos = {
              proveedor: "facebook.com",
              idSocial: userData.id,
              email: userData.email,
              nombre,
              apellido,
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
              alert("Falló el login en backend: " + json.error);
            }
          });
        } else {
          alert("Login cancelado o no autorizado.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <button className="btn btn-primary w-100 mt-2" onClick={handleFacebookLogin}>
      Iniciar sesión con Facebook
    </button>
  );
};

export default LoginFacebook;
