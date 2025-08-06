import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import Usuario from "../models/usuario.js";

// Resolvé ruta absoluta al .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function crearUsuarioAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI no está definido en el .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🟢 Conectado a MongoDB");

    const existe = await Usuario.findOne({ usuario: "admin" });
    if (existe) {
      console.log("⚠️ El usuario 'admin' ya existe.");
      return;
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    const nuevoUsuario = new Usuario({
      usuario: "admin",
      password: passwordHash,
      nombre: "Admin",
      apellido: "Principal",
      email: "admin@example.com",
      rol: "ROLE_ADMINISTRADOR",
    });

    await nuevoUsuario.save();
    console.log("✅ Usuario administrador creado con éxito.");
  } catch (err) {
    console.error("❌ Error al crear el usuario:", err);
  } finally {
    await mongoose.disconnect();
  }
}

crearUsuarioAdmin();
