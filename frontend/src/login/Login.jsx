import React, { useEffect, useState } from "react";
import packageJson from "../../package.json"; // lee versión frontend
import LoginForm from "./LoginForm";
import LoginGoogle from "./LoginGoogle";
import LoginFacebook from "./LoginFacebook";
import LoginInvitado from "./LoginInvitado";

const Login = () => {
  const basedir = process.env.REACT_APP_BASEDIR;
  const url = process.env.REACT_APP_URL;

  const [backendVersion, setBackendVersion] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const res = await fetch(`${url}/${basedir}/api/version`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setBackendVersion(data.version);
      } catch (err) {
        console.error("Error obteniendo versión backend:", err);
      }
    };

    fetchVersion();
  }, [url, basedir]);

  return (
    <>
      {/* Bootstrap 5.3.3 */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossOrigin="anonymous"
      />
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
        rel="stylesheet"
      />
      {/* Íconos */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      {/* ESTILOS */}
      <style>{`
        :root {
          --bodega-terracota: #7d2e18;
          --bodega-tinto: #4c1e1e;
          --bodega-roble: #a67c52;
          --bodega-cream: #f5f1e9;
          --bodega-gold: #c9a95c;
        }

        .login-container {
          margin: 0;
          font-family: "Lora", serif;
          background: url("https://images.unsplash.com/photo-1585559606442-93d3e1a0e3d4?auto=format&fit=crop&w=1350&q=80")
            no-repeat center center/cover fixed;
        }

        .bodega-wrapper {
          width: 100%;
          max-width: 430px;
          background: rgba(76, 30, 30, 0.75);
          backdrop-filter: blur(6px);
          border: 1px solid var(--bodega-gold);
          border-radius: 1rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
          color: var(--bodega-cream);
        }

        .bodega-title {
          font-family: "Cinzel", serif;
          font-weight: 600;
          font-size: 2.2rem;
          color: var(--bodega-gold);
        }

        .bodega-subtitle {
          font-style: italic;
          font-size: 1rem;
          color: var(--bodega-cream);
        }

        .bodega-logo {
          width: 100px;
          filter: sepia(100%) saturate(200%) hue-rotate(15deg) drop-shadow(0 2px 4px rgba(0,0,0,.4));
        }

        .divider-line {
          height: 1px;
          background: var(--bodega-roble);
        }

        .divider-text {
          color: var(--bodega-gold);
          font-size: 0.9rem;
        }

        .btn-bodega {
          background: var(--bodega-gold);
          color: var(--bodega-tinto);
          border: none;
          font-weight: 600;
          border-radius: 0.5rem;
          transition: all .3s ease;
        }
        .btn-bodega:hover {
          background: #d4b36a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 169, 92, 0.5);
        }

        .footer-bodega {
          font-size: 0.75rem;
          color: var(--bodega-cream);
          opacity: .8;
        }
      `}</style>

      {/* CONTENIDO */}
      <div className="login-container vh-100 d-flex align-items-center justify-content-center">
        <div className="bodega-wrapper p-4 pb-3">
          <div className="text-center">
            <img
              className="bodega-logo mb-3"
              src="/img_logo/educacionit_logo.jpeg"
              alt="Logo de la bodega"
            />
            <h1 className="bodega-title mb-0">Bodega Integrador3</h1>
            <p className="bodega-subtitle mb-3">Reserva exclusiva · Acceso socios</p>
          </div>

          {/* Formularios de acceso */}
          <LoginForm />

          <div className="d-flex align-items-center my-2 mb-1">
            <hr className="divider-line flex-grow-1 me-3" />
            <span className="divider-text">o continúa con</span>
            <hr className="divider-line flex-grow-1 ms-3" />
          </div>
          <div className="d-grid gap-0">
            <LoginGoogle />
            <LoginFacebook />
          </div>

          <div className="d-flex align-items-center my-2 mb-1">
            <hr className="divider-line flex-grow-1 me-3" />
            <span className="divider-text">¿Eres visitante?</span>
            <hr className="divider-line flex-grow-1 ms-3" />
          </div>
          <div className="d-grid gap-0">
            <LoginInvitado 
              rol="ROLE_CONSULTA"
              caption="Ingresar como Invitado"
            />
            <LoginInvitado 
              rol="ROLE_CLIENTE"
              caption="Ingresar como Cliente"
            />
            <LoginInvitado 
              rol="ROLE_ADMINISTRADOR"
              caption="Ingresar como Administrador"
            />
          </div>

          <p className="footer-bodega mt-3 text-center">
            Front: v{packageJson.version} — Back: v{backendVersion || "…"} <br />
            © 2025 — Desarrollado por robertosl77@gmail.com
          </p>
        </div>
      </div>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        crossOrigin="anonymous"
      />
    </>
  );
};

export default Login;