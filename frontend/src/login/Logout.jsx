export const logout = async () => {
  try {
    const res = await fetch("http://localhost:8081/integrador3/api/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const resData = await res.json();
    window.location.href = resData.redirect || "/integrador3/login";
  } catch (error) {
    window.location.href = "/integrador3/login";
  }
};