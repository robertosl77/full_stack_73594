import LoginForm from "./LoginForm";
import LoginGoogle from "./LoginGoogle";
import LoginFacebook from "./LoginFacebook";
import LoginInvitado from "./LoginInvitado";

const Login = () => {
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/css/sign-in.css" />
      <link
        rel="icon"
        href="https://getbootstrap.com/docs/5.3/assets/img/favicons/favicon-32x32.png"
        type="image/png"
        sizes="32x32"
      />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous" />

      <div className="d-flex align-items-center py-4 bg-body-tertiary min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <main className="form-signin w-100 m-auto">
                <img className="mb-4" src="/img_logo/educacionit_logo.jpeg" alt="" width="100" />
                <h1 className="h3 mb-3 fw-normal">Proyecto: Integrador3</h1>

                <LoginForm />
                <LoginGoogle />
                <LoginFacebook />
                <LoginInvitado />

                <p className="mt-5 mb-3 text-body-secondary">
                  &copy; 2025 - Integrador3 - Desarrollado por robertosl77@gmail.com
                </p>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
