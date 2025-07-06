import { getBasedirFromToken } from "../utils/tokenUtils"

// src/utils/apiFetch.js
export async function apiFetch(api, options = {}) {
    const basedir = getBasedirFromToken();
    const token = localStorage.getItem("token");

    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
    };

    const config = {
        ...options,
        headers,
        credentials: "include",
    };

    try {
        const url = `http://localhost:8081`+basedir+api;
        const response = await fetch(url, config);

        if (response.status === 401 || response.status === 403) {
            console.warn("Acceso denegado. Redirigiendo al login.");
            window.location.href = basedir + "/login";
            return;
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (err) {
        console.error("Error al hacer fetch:", err);
        throw err;
    }
}
