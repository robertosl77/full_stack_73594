import LoginForm from "./LoginForm";
import LoginGoogle from "./LoginGoogle";
import LoginFacebook from "./LoginFacebook";
import LoginInvitado from "./LoginInvitado";
import LoginAdmin from "./LoginAdmin";

const Login = () => {
  return (
    <>
      <div
        className="d-flex align-items-start justify-content-center min-vh-100"
        style={{
          backgroundImage: `url('/img_bodega/fondo_viñedo.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="p-4"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
            borderRadius: "1rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            maxWidth: "420px",
            width: "100%",
          }}
        >
          <div className="text-center mb-4">
            <img
              src="/img_logo/educacionit_logo.jpeg"
              alt="Logo"
              width="100"
              className="mb-2"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />
            <h1 className="h4 fw-bold" style={{ fontFamily: "Playfair Display, serif", color: "#6a1b9a" }}>
              Ingreso a la Bodega
            </h1>
            <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
              Proyecto Integrador3
            </p>
            <hr />
          </div>

          <LoginForm />

          <div className="text-center my-3">
            <span className="text-muted">O ingresa con</span>
          </div>

          <div className="d-grid gap-2">
            <LoginGoogle />
            <LoginFacebook />
            <LoginInvitado />
            <LoginAdmin />
          </div>

          <p className="mt-4 mb-0 text-center text-secondary" style={{ fontSize: "0.8rem" }}>
            &copy; 2025 - Integrador3 <br /> Desarrollado por <a href="mailto:robertosl77@gmail.com">robertosl77@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
