// crear_usuario.js

import mongoose from "mongoose"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

const mongoUri = process.env.MONGODB_URI

const usuarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String },
  apellido: { type: String },
  email: { type: String }, // Sin unique para permitir duplicados con diferentes proveedores
  rol: {
    type: String,
    enum: ["ROLE_ADMINISTRADOR", "ROLE_CLIENTE", "ROLE_CONSULTA", "ROLE_VISTA"],
    default: "ROLE_CLIENTE",
  },
  // Nuevo campo rrss como array
  rrss: [
    {
      proveedor: { type: String },
      idSocial: { type: String },
      email: { type: String },
    },
  ],
})

const Usuario = mongoose.model("Usuario", usuarioSchema, "usuarios")

async function connectDB() {
  await mongoose.connect(mongoUri)
  console.log("Conectado a MongoDB")
}

async function disconnectDB() {
  await mongoose.disconnect()
  console.log("Desconectado de MongoDB")
}

async function crearUsuario(datosUsuario) {
  try {
    const existente = await Usuario.findOne({
      $or: [{ usuario: datosUsuario.usuario }, { email: datosUsuario.email }],
    })

    if (existente) {
      console.log(`El usuario ${datosUsuario.usuario} ya existe, no se insertó.`)
      return false
    } else {
      const hash = await bcrypt.hash(datosUsuario.password, 10)

      // Crear usuario con rrss como array vacío por defecto
      const nuevoUsuario = {
        ...datosUsuario,
        password: hash,
        rrss: datosUsuario.rrss || [], // Array vacío si no se especifica
      }

      await Usuario.create(nuevoUsuario)
      console.log(`✅ Usuario ${datosUsuario.usuario} creado exitosamente.`)
      return true
    }
  } catch (err) {
    console.error(`❌ Error al crear usuario ${datosUsuario.usuario}:`, err)
    return false
  }
}

async function crearUsuarios() {
  const usuarios = [
    {
      usuario: "admin",
      password: "admin123",
      nombre: "Administrador",
      apellido: "",
      email: "admin@ejemplo.com",
      rol: "ROLE_ADMINISTRADOR",
    },
    {
      usuario: "invitado",
      password: "~~",
      nombre: "Invitado",
      apellido: "",
      email: "invitado@demo.com",
      rol: "ROLE_VISTA",
    },
    {
      usuario: "robertosl77",
      password: "12345",
      nombre: "Roberto",
      apellido: "Sanchez Leiva",
      email: "robertosl77@gmail.com",
      rol: "ROLE_ADMINISTRADOR",
    },
    // Usuario de ejemplo que ya tiene redes sociales configuradas
    {
      usuario: "usuario_social",
      password: "~~", // Password dummy para usuarios de redes sociales
      nombre: "Usuario",
      apellido: "Social",
      email: "usuario.social@ejemplo.com",
      rol: "ROLE_CLIENTE",
      rrss: [
        {
          proveedor: "google.com",
          idSocial: "google_123456789",
          email: "usuario.social@gmail.com",
        },
      ],
    },
  ]

  console.log(`Creando ${usuarios.length} usuarios...`)

  let creados = 0
  for (const usuario of usuarios) {
    const resultado = await crearUsuario(usuario)
    if (resultado) creados++
  }

  console.log(`\n📊 Resumen: ${creados} usuarios creados de ${usuarios.length} intentos.`)
}

async function main() {
  try {
    await connectDB()
    await crearUsuarios()
  } catch (err) {
    console.error("Error general:", err)
  } finally {
    await disconnectDB()
  }
}

main()
