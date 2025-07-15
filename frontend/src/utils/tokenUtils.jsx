// src/utils/tokenUtils.js
import { jwtDecode } from "jwt-decode"

export function getBasedirFromToken() {
  try {
    const token = localStorage.getItem("token")
    if (!token) return "/"
    const decoded = jwtDecode(token)
    return decoded.basedir || "/"
  } catch (e) {
    return "/"
  }
}

export function getRolFromToken() {
  try {
    const token = localStorage.getItem("token")
    if (!token) return null
    const decoded = jwtDecode(token)
    return decoded.rol || null
  } catch (e) {
    return null
  }
}

export function esVista() {
  try {
    return getRolFromToken() === "ROLE_VISTA"
  } catch (e) {
    return false
  }
}
