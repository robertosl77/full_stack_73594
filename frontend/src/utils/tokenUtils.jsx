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
