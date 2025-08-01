import React from "react";
import LoginForm from "./LoginForm";
import LoginGoogle from "./LoginGoogle";
import LoginFacebook from "./LoginFacebook";
import LoginInvitado from "./LoginInvitado";
import LoginAdmin from "./LoginAdmin";

const Login = () => {
  return (
    <>
      {/* Bootstrap 5.3.5 */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
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

      {/*  ESTILOS  */}
      <style>{`
        :root {
          --bodega-terracota: #7d2e18;
          --bodega-tinto: #4c1e1e;
          --bodega-roble: #a67c52;
          --bodega-cream: #f5f1e9;
          --bodega-gold: #c9a95c;
        }

        body {
          margin: 0;
          font-family: "Lora", serif;
          background: url("https://images.unsplash.com/photo-1585559606442-93d3e1a0e3d4?auto=format&fit=crop&w=1350&q=80")
            no-repeat center center/cover fixed;
          min-height: 100vh;
          display: flex;
          align-items: start;
          justify-content: center;
        }

        .bodega-wrapper {
          width: 100%;
          max-width: 430px;
          padding: 2rem 2rem 1.5rem;
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
          text-align: center;
          margin-bottom: 0;
        }

        .bodega-subtitle {
          font-style: italic;
          font-size: 1rem;
          color: var(--bodega-cream);
          text-align: center;
          margin-bottom: 1rem;
        }

        .bodega-logo {
          width: 100px;
          filter: sepia(100%) saturate(200%) hue-rotate(15deg) drop-shadow(0 2px 4px rgba(0,0,0,.4));
          margin-bottom: 1rem;
        }

        .divider-bodega {
          display: flex;
          align-items: center;
          margin: 1rem 0;
          color: var(--bodega-gold);
          font-size: 0.9rem;
        }
        .divider-bodega::before,
        .divider-bodega::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--bodega-roble);
        }
        .divider-bodega::before { margin-right: 1rem; }
        .divider-bodega::after  { margin-left: 1rem; }

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
          text-align: center;
          margin-top: 1rem;
          opacity: .8;
        }
      `}</style>

      {/*  CONTENIDO  */}
      <div className="bodega-wrapper">
        <div className="text-center">
          <img
            className="bodega-logo"
            src="/img_logo/educacionit_logo.jpeg"
            alt="Logo de la bodega"
          />
          <h1 className="bodega-title">Bodega Integrador3</h1>
          <p className="bodega-subtitle">Reserva exclusiva · Acceso socios</p>
        </div>

        {/* Formularios de acceso */}
        <LoginForm />

        <div className="divider-bodega">o continúa con</div>
        <div className="d-grid gap-2">
          <LoginGoogle />
          <LoginFacebook />
        </div>

        <div className="divider-bodega">¿Eres visitante?</div>
        <div className="d-grid gap-2">
          <LoginInvitado />
          <LoginAdmin />
        </div>

        <p className="footer-bodega">
          © 2025 — Desarrollado por robertosl77@gmail.com
        </p>
      </div>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
        crossOrigin="anonymous"
      />
    </>
  );
};

export default Login;