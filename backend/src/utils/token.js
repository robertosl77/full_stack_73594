import jwt from "jsonwebtoken";

export const generarTokenUsuario = (usuarioBase, origen = "loginLocal") => {
  const payload = {
    _id: usuarioBase._id.toString(), // 👈 este campo es clave
    usuario: usuarioBase.usuario,
    nombre: usuarioBase.nombre || "",
    apellido: usuarioBase.apellido || "",
    email: usuarioBase.email || "",
    rol: usuarioBase.rol || "ROLE_CLIENTE",
    origen,
    basedir: process.env.BASEDIR || "",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "clave-secreta", {
    expiresIn: "2h",
  });

  return { token, payload };
};


export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token faltante" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave-secreta");
    req.user = decoded; // <-- contiene usuario, rol, etc.
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
  }
};

export const permitirSolo = (rolesPermitidos) => (req, res, next) => {
  if (!rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
};