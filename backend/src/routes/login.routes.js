// src/routes/login.routes.js
import express from "express"
import bcrypt from "bcrypt"
import Usuario from "../models/usuario.js"
import { generarTokenUsuario } from "../utils/token.js"

const router = express.Router()

router.get("/api/logout", (req, res) => {
  console.info("=== LOGOUT SOLICITADO ===");
  if (req.session?.user) {
    console.info("Usuario local:", req.session.user.email || req.session.user.usuario || "desconocido");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Error al destruir la sesión:", err);
      return res.json({ success: false, redirect: `${res.locals.basedir}/login` });  // fallback
    }

    console.info("✅ Sesión local destruida, redirigiendo a login");
    res.json({ success: true, redirect: `${res.locals.basedir}/login` });
  });
});

router.post("/api/loginInvitado", async (req, res) => {
  const { proveedor, usuario, email, nombre, apellido } = req.body;

  try {
    if (!proveedor || !usuario || !email) {
      throw new Error("Datos incompletos");
    }

    const sessionUser = {
      _id: usuario, // ⚠️ mismo string, pero ahora compatible con rutas que usan req.user._id
      usuario,
      nombre: nombre || "",
      apellido: apellido || "",
      email,
      rol: "ROLE_VISTA",
      origen: proveedor,
    };

    const { token, payload } = generarTokenUsuario(sessionUser, proveedor);

    req.session.user = payload;

    res.json({
      success: true,
      redirect: `${res.locals.basedir}/productos`,
      token,
    });
  } catch (err) {
    console.error("Error en /loginInvitado:", err);
    res.status(500).json({ success: false, error: "Error al procesar login" });
  }
});

router.post("/api/loginForm", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = await Usuario.findOne({ usuario });

    if (!user) {
      return res.json({ success: false, error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ success: false, error: "Contraseña incorrecta" });
    }

    const { token, payload } = generarTokenUsuario(user, "loginLocal");

    req.session.user = payload;

    console.info("✅ Login exitoso:", user.usuario);
    res.json({
      success: true,
      redirect: `${res.locals.basedir}/productos`,
      token,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.json({ success: false, error: "Error interno del servidor" });
  }
});

// Login con firebase (Google)
router.post("/api/loginGoogle", async (req, res) => {
  const { proveedor, idSocial, email, nombre, apellido } = req.body;

  try {
    if (!proveedor || !idSocial || !email) {
      throw new Error("Datos incompletos");
    }

    // Reutiliza la lógica de asociación
    const sessionUser = await procesarLoginSocialMultiple({ proveedor, idSocial, email, nombre, apellido });

    // Generar token (incluye todos los datos del usuario)
    const { token, payload } = generarTokenUsuario(sessionUser, proveedor);

    // Guarda en sesión si querés mantener compatibilidad
    req.session.user = payload;

    res.json({
      success: true,
      redirect: `${res.locals.basedir}/productos`,
      token,
    });
  } catch (err) {
    console.error("❌ Error en /loginGoogle:", err);
    res.status(500).json({ success: false, error: "Error al procesar login con Google" });
  }
});

// Nueva ruta para Facebook directo
router.post("/api/loginFacebook", async (req, res) => {
  const { accessToken } = req.body;

  try {
    if (!accessToken) throw new Error("Falta accessToken");

    // Obtener perfil desde Facebook Graph API
    const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`);
    const userInfo = await fbRes.json();

    if (!userInfo?.email) throw new Error("Facebook no devolvió email");

    const sessionUser = await procesarLoginSocialMultiple({
      proveedor: 'facebook.com',
      idSocial: userInfo.id,
      email: userInfo.email,
      nombre: userInfo.first_name,
      apellido: userInfo.last_name
    });

    const { token, payload } = generarTokenUsuario(sessionUser, 'facebook.com');
    req.session.user = payload;

    res.json({ success: true, redirect: `${res.locals.basedir}/productos`, token });

  } catch (err) {
    console.error("Error en /loginFacebook:", err);
    res.status(500).json({ success: false, error: "Error al procesar login con Facebook" });
  }
});

// Nueva función que maneja múltiples redes sociales
async function procesarLoginSocialMultiple({ proveedor, idSocial, email, nombre, apellido }) {
  console.info("Procesando login social:", { proveedor, idSocial, email });

  let user = await Usuario.findOne({ "rrss.idSocial": idSocial, "rrss.proveedor": proveedor });

  if (user) {
    console.info("Usuario encontrado por idSocial:", user.email);

    const rrssIndex = user.rrss.findIndex((r) => r.proveedor === proveedor && r.idSocial === idSocial);
    if (rrssIndex >= 0 && user.rrss[rrssIndex].email !== email) {
      user.rrss[rrssIndex].email = email;
      await user.save();
      console.info("Email actualizado para el proveedor:", proveedor);
    }
  } else {
    user = await Usuario.findOne({ email });

    if (user) {
      console.info("Usuario encontrado por email:", email);

      const existingProvider = user.rrss.find((r) => r.proveedor === proveedor);

      if (!existingProvider) {
        if (!Array.isArray(user.rrss)) {
          user.rrss = user.rrss ? [user.rrss] : [];
        }

        user.rrss.push({ proveedor, idSocial, email });
        await user.save();
        console.info("Proveedor", proveedor, "agregado al usuario existente");
      } else {
        const rrssIndex = user.rrss.findIndex((r) => r.proveedor === proveedor);
        if (user.rrss[rrssIndex].idSocial !== idSocial) {
          user.rrss[rrssIndex].idSocial = idSocial;
          await user.save();
          console.info("IdSocial actualizado para el proveedor:", proveedor);
        }
      }
    } else {
      user = new Usuario({
        usuario: email.split("@")[0],
        nombre,
        apellido,
        email,
        rol: "ROLE_CONSULTA", // 👈 actualizado
        password: "~~",
        rrss: [{ proveedor, idSocial, email }],
      });
      await user.save();
      console.info("Nuevo usuario creado:", email);
    }
  }

  return {
    _id: user._id,
    usuario: user.usuario,
    rol: user.rol,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    proveedor: proveedor,
  };
}

export default router
