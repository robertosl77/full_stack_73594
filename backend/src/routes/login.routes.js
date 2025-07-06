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
    console.log(res.locals.basedir);
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
    
    const sessionUser = {
      usuario: email, // si no usás username aparte, podés usar el email como identificador
      nombre: nombre || "",
      apellido: apellido || "",
      email,
      rol: "ROLE_VISTA",  // 🔐 fuerza el rol mínimo para Google/Firebase
      origen: proveedor,
    };

    const { token, payload } = generarTokenUsuario(sessionUser, proveedor);
    
    // Opcional: guardar en sesión también, si mantenés alguna parte con session
    req.session.user = payload;
    
    res.json({
      success: true,
      redirect: `${res.locals.basedir}/productos`,
      token,
    });
  } catch (err) {
    console.error("❌ Error en /loginFirebase:", err);
    res.status(500).json({ success: false, error: "Error al procesar login con Google" });
  }
});











router.get("/api/login", (req, res) => {
  console.log(111111111111111);
  res.render("login", { layout: false })
})

router.post("/api/login", async (req, res) => {
  console.log(111111111111111);
  const { usuario, password } = req.body
  const user = await Usuario.findOne({ usuario })
  
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = {
      _id: user._id,
      usuario: user.usuario,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
    }

    // 👇 CAMBIÁ ESTO:
    // res.redirect(`${res.locals.basedir}/productos`)
    
    // 👇 POR ESTO:
    res.json({ success: true, redirect: `${res.locals.basedir}/productos` })

  } else {
    // 👇 Igual acá: devolvé JSON si falla
    res.status(401).json({ success: false, error: "Usuario o contraseña incorrectos" })
  }
})





// Nueva ruta para Facebook directo
router.post("/loginFacebookDirect", async (req, res) => {
  const { proveedor, idSocial, email, nombre, apellido } = req.body

  try {
    console.info("=== LOGIN FACEBOOK DIRECTO ===")
    console.info("Datos recibidos:", { proveedor, idSocial, email, nombre, apellido })

    if (!proveedor || !idSocial || !email) {
      throw new Error("Datos incompletos de Facebook")
    }

    // Usar la misma función que Firebase pero sin restricciones
    const sessionUser = await procesarLoginSocialMultiple({ proveedor, idSocial, email, nombre, apellido })

    req.session.user = sessionUser
    console.info("✅ Sesión creada para usuario Facebook:", sessionUser.email)

    res.json({ success: true, redirect: `${res.locals.basedir}/productos` })
  } catch (err) {
    console.error("Error en /loginFacebookDirect:", err)
    res.status(500).json({ success: false, error: "Error al procesar login con Facebook" })
  }
})

// Nueva función que maneja múltiples redes sociales
async function procesarLoginSocialMultiple({ proveedor, idSocial, email, nombre, apellido }) {
  console.log(111111111111111);

  console.info("Procesando login social:", { proveedor, idSocial, email })

  // 1. Buscar si existe un usuario con este idSocial y proveedor
  let user = await Usuario.findOne({ "rrss.idSocial": idSocial, "rrss.proveedor": proveedor })

  if (user) {
    console.info("Usuario encontrado por idSocial:", user.email)

    // Actualizar el email si cambió
    const rrssIndex = user.rrss.findIndex((r) => r.proveedor === proveedor && r.idSocial === idSocial)
    if (rrssIndex >= 0 && user.rrss[rrssIndex].email !== email) {
      user.rrss[rrssIndex].email = email
      await user.save()
      console.info("Email actualizado para el proveedor:", proveedor)
    }
  } else {
    // 2. Si no existe por idSocial, buscar por email
    user = await Usuario.findOne({ email })

    if (user) {
      console.info("Usuario encontrado por email:", email)

      // Verificar si ya tiene este proveedor
      const existingProvider = user.rrss.find((r) => r.proveedor === proveedor)

      if (!existingProvider) {
        // Agregar este proveedor a sus redes sociales
        // Asegurarse de que rrss sea un array
        if (!Array.isArray(user.rrss)) {
          // Migrar de objeto a array si es necesario
          user.rrss = user.rrss ? [user.rrss] : []
        }

        user.rrss.push({ proveedor, idSocial, email })
        await user.save()
        console.info("Proveedor", proveedor, "agregado al usuario existente")
      } else {
        // Actualizar el idSocial si cambió
        const rrssIndex = user.rrss.findIndex((r) => r.proveedor === proveedor)
        if (user.rrss[rrssIndex].idSocial !== idSocial) {
          user.rrss[rrssIndex].idSocial = idSocial
          await user.save()
          console.info("IdSocial actualizado para el proveedor:", proveedor)
        }
      }
    } else {
      // 3. Si no existe, crear un nuevo usuario
      user = new Usuario({
        usuario: email.split("@")[0],
        nombre,
        apellido,
        email,
        rol: "ROLE_CLIENTE",
        password: "~~",
        rrss: [{ proveedor, idSocial, email }],
      })
      await user.save()
      console.info("Nuevo usuario creado:", email)
    }
  }

  return {
    _id: user._id,
    rol: user.rol,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    proveedor: proveedor,
  }
}



export default router
