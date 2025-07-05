export const logout = async () => {
  // Borrar token del frontend
  localStorage.removeItem("token");

  // Notificar al backend por si hay sesión activa
  try {
    await fetch("http://localhost:8081/integrador3/api/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  } catch (e) {
    // Ignorar error
  } finally {
    // Redirigir siempre
    window.location.href = "/integrador3/login";
  }
};
