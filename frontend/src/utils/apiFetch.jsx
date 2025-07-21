import { getBasedirFromToken } from "../utils/tokenUtils"

// src/utils/apiFetch.js
export async function apiFetch(api, options = {}) {
  const basedir = getBasedirFromToken(); // obtiene la ruta base desde el token
  const token = localStorage.getItem("token"); // token JWT almacenado

  // arma los headers con Authorization, y si no es FormData, también Content-Type
  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  // si el body no es FormData, se agrega Content-Type JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // configura la request con headers, método y credenciales
  const config = {
    ...options,
    headers,
    credentials: "include", // incluye cookies/sesión
  };

  try {
    const url = `http://localhost:8081${basedir}${api}`; // URL completa
    const response = await fetch(url, config); // hace el fetch

    // si el token es inválido, redirige a login
    if (response.status === 401) {
      console.warn("No autorizado. Redirigiendo a login.");
      window.location.href = basedir + "/login";
      return;
    }

    // si la respuesta no es exitosa, lanza error con texto
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    // si todo ok, devuelve el JSON
    return await response.json();
  } catch (err) {
    console.error("Error al hacer fetch:", err);
    throw err;
  }
}
