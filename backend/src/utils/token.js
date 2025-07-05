import jwt from "jsonwebtoken";

export const generarTokenUsuario = (usuarioBase, origen = "loginLocal") => {
  const payload = {
    usuario: usuarioBase.usuario,
    nombre: usuarioBase.nombre || "",
    apellido: usuarioBase.apellido || "",
    email: usuarioBase.email || "",
    rol: usuarioBase.rol || "ROLE_CLIENTE",
    origen,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "clave-secreta", {
    expiresIn: "2h",
  });

  return { token, payload };
};
