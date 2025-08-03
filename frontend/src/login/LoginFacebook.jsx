/**
 * COMPONENTE REUTILIZABLE: LoginFacebook
 * ------------------------------------------------------------
 * Este componente permite iniciar sesión con Facebook vía Firebase.
 * Se puede copiar y pegar en cualquier proyecto React sin necesidad
 * de importar firebase-config por separado.
 * 
 * ✅ USO:
 * 
 * 1. Asegurate de tener Firebase instalado:
 *    npm install firebase
 * 
 * 2. En tu backend, implementá una ruta POST /loginFacebook
 *    que reciba: { email, nombre, apellido, proveedor, idSocial }
 * 
 * 3. Desde cualquier componente:
 *    import LoginFacebook from './LoginFacebook';
 *    ...
 *    <LoginFacebook />
 * 
 * 4. Si tu backend responde con:
 *    { success: true, user: { username, rol }, redirect: '/SGE/Afectaciones' }
 *    entonces se guarda en sessionStorage y se redirige automáticamente.
 * 
 * 5. Asegurate de tener configurado Facebook como proveedor
 *    en la consola de Firebase y haber agregado el dominio autorizado.
 */

import React, { useEffect, useState } from 'react';

/* global FB */

function LoginFacebook() {
  const basedir = process.env.REACT_APP_BASEDIR;
  const url = process.env.REACT_APP_URL;

  const [error, setError] = useState("");

  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
          appId: '2439166789800873', // Tu App ID
          cookie: true,
          xfbml: true,
          version: 'v18.0'
      });
    };

    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/es_LA/sdk.js";
      d.getElementsByTagName(s)[0].parentNode.insertBefore(js, d.getElementsByTagName(s)[0]);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const iniciarLogin = () => {
    FB.login(response => {
      if (response.authResponse) {
        loginBackend(response.authResponse.accessToken);
      } else {
        alert('El usuario canceló el login o no autorizó la app.');
      }
    }, { scope: 'email' });
  };

  const loginBackend = async (accessToken) => {
    console.log(basedir);
    try {
      const res = await fetch(`${url}/${basedir}/api/loginFacebook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
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
      console.error('Error enviando el token al backend:', error);
      alert('Error de red o del servidor');
    }
  };

  return (
    <>
      <button 
        type="button" 
        id="facebookLoginBtn"    
        className="btn btn-primary w-100" 
        style={{ backgroundColor: '#4267B2', marginTop: '6px' }}
        onClick={iniciarLogin} 
      >
        Iniciar sesión con Facebook
      </button>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}    
    </>
  );
}

export default LoginFacebook;
