import { useEffect, useState } from "react";

const Login = () => {
  const [error, setError] = useState("");

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

    // Demo login
    document.getElementById("demoLoginBtn")?.addEventListener("click", async () => {
      const datos = {
        proveedor: "demo",
        idSocial: "demo_user",
        email: "invitado@demo.com",
        nombre: "Invitado",
        apellido: "Demo",
      };
      const res = await fetch("/loginFirebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const resData = await res.json();
      if (resData.success) window.location.href = resData.redirect;
      else alert("Falló login demo: " + resData.error);
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
          <form action="/login" method="POST">
            <img className="mb-4" src="/img_logo/educacionit_logo.jpeg" alt="" width="100" />
            <h1 className="h3 mb-3 fw-normal">Proyecto: Integrador2</h1>

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="usuario"
                id="usuario"
                placeholder="Usuario"
                required
              />
              <label htmlFor="usuario">Usuario</label>
            </div>

            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <style>{`
              .btn-teal {
                background-color: #20c997;
                border-color: #1cb386;
                color: white;
              }
              .btn-teal:hover {
                background-color: #1cb386;
                border-color: #199d76;
              }
            `}</style>

            <button className="btn btn-teal w-100 py-2" type="submit">Ingreso</button>

            {error && (
              <div className="alert alert-danger mt-4" role="alert">
                {error}
              </div>
            )}

            <div className="mt-2">
              <button type="button" className="btn btn-danger w-100" id="googleLoginBtn">
                Iniciar sesión con Google
              </button>
            </div>

            <div className="mt-2">
              <button type="button" className="btn btn-primary w-100" id="facebookLoginBtn">
                Iniciar sesión con Facebook
              </button>
            </div>

            <div className="mt-2">
              <button type="button" className="btn btn-secondary w-100" id="demoLoginBtn">
                Ingresar como usuario invitado
              </button>
            </div>

            <p className="mt-5 mb-3 text-body-secondary">
              &copy; 2025 - Integrador2 - Desarrollado por robertosl77@gmail.com
            </p>
          </form>
        </main>
      </div>
    </>
  );
};

export default Login;
