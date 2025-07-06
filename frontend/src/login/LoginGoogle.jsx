/**
 * COMPONENTE REUTILIZABLE: LoginGoogle
 * ------------------------------------------------------------
 * Este componente permite iniciar sesión con Google vía Firebase.
 * Se puede copiar y pegar en cualquier proyecto React sin necesidad
 * de importar firebase-config por separado.
 * 
 * ✅ USO:
 * 
 * 1. Asegurate de tener Firebase instalado:
 *    npm install firebase
 * 
 * 2. En tu backend, implementá una ruta POST /loginFirebase
 *    que reciba: { proveedor, idSocial, usuario, email, phoneNumber, photoURL, nombre, apellido, rol }
 * 
 * 3. Desde cualquier componente:
 *    import LoginGoogle from './LoginGoogle';
 *    ...
 *    <LoginGoogle />
 * 
 * 4. Si tu backend responde con:
 *    { success: true, user: data, redirect: '/SGE/Afectaciones' }
 *    entonces se guarda en sessionStorage y se redirige automáticamente.
 */

import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// ✅ Configuración embebida de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQxsS5nD8mew28riq2o9zL6-1oYN3BcOo",
  authDomain: "integrador2-efccd.firebaseapp.com",
  projectId: "integrador2-efccd",
  storageBucket: "integrador2-efccd.appspot.com",
  messagingSenderId: "791374823620",
  appId: "1:791374823620:web:5b60e3caa0f49d302fc991",
  measurementId: "G-ZD8P3HRS9"
};

const auth = getAuth(initializeApp(firebaseConfig));

function LoginGoogle() {
  const [error, setError] = useState("");

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const raw = user.providerData.find(p => p.providerId === 'google.com');

      const datos = {
        proveedor: raw?.providerId || 'google.com',
        idSocial: raw?.uid || user.uid,
        usuario: raw?.displayName || user.reloadUserInfo?.screenName || raw?.uid || user.uid,
        email: raw?.email || user.email || null,
        phoneNumber: raw?.phoneNumber || user.phoneNumber || null,
        photoURL: raw?.photoURL || user.photoURL || null,
        nombre: raw?.nombre || user.displayName?.split(' ')[0] || '',
        apellido: raw?.apellido || user.displayName?.split(' ')[1] || '',
        rol: 'operador'
      };        

      const res = await fetch(`http://localhost:8081/integrador3/api/loginGoogle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
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
      console.error("Error completo:", error);

      if (error.code === 'auth/account-exists-with-different-credential') {
        setError(`Este email ya está registrado con otro proveedor. Usá el método correspondiente (${error.customData?.email}).`);
      } else if (error.code !== 'auth/popup-closed-by-user') {
        setError("Error de autenticación: " + error.message);
      }
    }
  };

  return (
    <>
      <button
        type="button" 
        id="googleLoginBtn"
        className="btn btn-danger w-100" 
        style={{ backgroundColor: '#db4437', marginTop: '10px' }}
        onClick={loginGoogle}
      >
        Iniciar sesión con Google
      </button>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}    
    </>
  );
}

export default LoginGoogle;
