import { useEffect } from "react";
import LoginForm from "./LoginForm";
import LoginInvitado from "./LoginInvitado";
import LoginGoogle from "./LoginGoogle";

const Login = () => {

  useEffect(() => {
    // Cargar scripts externos
    const fbScript = document.createElement("script");
    fbScript.async = true;
    fbScript.defer = true;
    fbScript.crossOrigin = "anonymous";
    fbScript.src = "https://connect.facebook.net/es_ES/sdk.js";
    document.body.appendChild(fbScript);

    // Firebase login Google
    import("https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js").then(({ initializeApp }) => {
      import("https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js").then(({ getAuth, GoogleAuthProvider, signInWithPopup }) => {
        const firebaseConfig = {
          apiKey: "AIzaSyAQxsS5nD8mew28riq2o9zL6-1oYN3BcOo",
          authDomain: "integrador2-efccd.firebaseapp.com",
          projectId: "integrador2-efccd",
          storageBucket: "integrador2-efccd.appspot.com",
          messagingSenderId: "791374823620",
          appId: "1:791374823620:web:5b60e3caa0f49d302fc991",
          measurementId: "G-ZD8P3HRS9",
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
          try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const datos = {
              proveedor: user.providerData[0]?.providerId || "desconocido",
              idSocial: user.providerData[0]?.uid,
              email: user.email,
              nombre: user.displayName?.split(" ")[0] || "",
              apellido: user.displayName?.split(" ")[1] || "",
            };
            const res = await fetch("/loginFirebase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(datos),
            });
            const resData = await res.json();
            if (resData.success) window.location.href = resData.redirect;
            else alert("Falló login backend: " + resData.error);
          } catch (err) {
            alert("Error login Google");
          }
        });
      });
    });

    // Facebook login
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "2439166789800873",
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });

      document.getElementById("facebookLoginBtn")?.addEventListener("click", () => {
        window.FB.login(
          (response) => {
            if (response.authResponse) {
              window.FB.api("/me", { fields: "name,email,first_name,last_name" }, function (userInfo) {
                const datos = {
                  proveedor: "facebook.com",
                  idSocial: userInfo.id,
                  email: userInfo.email || `${userInfo.id}@facebook.com`,
                  nombre: userInfo.first_name || "",
                  apellido: userInfo.last_name || "",
                };
                fetch("/loginFacebookDirect", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(datos),
                })
                  .then((res) => res.json())
                  .then((resData) => {
                    if (resData.success) window.location.href = resData.redirect;
                    else alert("Falló login Facebook: " + resData.error);
                  })
                  .catch(() => alert("Error al procesar Facebook"));
              });
            } else {
              alert("Login Facebook cancelado");
            }
          },
          { scope: "email" }
        );
      });
    };
  }, []);

  return (
    <>
      {/* HEAD EQUIVALENTE */}
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

      {/* BODY */}
      <div className="d-flex align-items-center py-4 bg-body-tertiary min-vh-100">
        <main className="form-signin w-100 m-auto">
          <img className="mb-4" src="/img_logo/educacionit_logo.jpeg" alt="" width="100" />
          <h1 className="h3 mb-3 fw-normal">Proyecto: Integrador3</h1>

          <LoginForm />

          <LoginGoogle />

          <div className="mt-2">
            <button type="button" className="btn btn-primary w-100" id="facebookLoginBtn">
              Iniciar sesión con Facebook
            </button>
          </div>

          <LoginInvitado />

          <p className="mt-5 mb-3 text-body-secondary">
            &copy; 2025 - Integrador3 - Desarrollado por robertosl77@gmail.com
          </p>
        </main>
      </div>
    </>
  );
};

export default Login;
