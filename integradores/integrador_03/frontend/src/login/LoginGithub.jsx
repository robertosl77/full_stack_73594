// src/login/LoginGithub.jsx
import React from "react";

const LoginGithub = () => {
  const handleGithubLogin = () => {
    window.location.href = "/integrador2/github/login"; // Ruta backend que inicia OAuth con GitHub
  };

  return (
    <button className="btn btn-dark w-100 mt-2" onClick={handleGithubLogin}>
      Iniciar sesión con GitHub
    </button>
  );
};

export default LoginGithub;
