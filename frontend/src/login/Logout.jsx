export const logout = async () => {
  const basedir = process.env.REACT_APP_BASEDIR;
  const url = process.env.REACT_APP_URL;

  // Borrar token del frontend
  localStorage.removeItem("token");

  // Notificar al backend por si hay sesión activa
  try {
    await fetch(`${url}/${basedir}/api/logout`, {
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
    window.location.href = `/${basedir}/login`;
  }
};
