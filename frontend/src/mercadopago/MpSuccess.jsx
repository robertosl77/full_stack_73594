// src/mercadopago/MpSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFetch } from "../utils/apiFetch";

export default function MpSuccess() {
  const navigate = useNavigate();
  const basedir = process.env.REACT_APP_BASEDIR ? `/${process.env.REACT_APP_BASEDIR}` : "";

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const status = (q.get("status") || q.get("collection_status") || "").toLowerCase();
    const comprobante = q.get("payment_id") || q.get("collection_id"); // nro MP
    const checkout = sessionStorage.getItem("checkout");

    if (status !== "approved" || !checkout) {
      sessionStorage.removeItem("checkout");
      navigate(`${basedir}/productos`, { replace: true });
      return;
    }

    (async () => {
      try {
        const payload = JSON.parse(checkout);
        await apiFetch("/api/carrito/comprar", { method: "PUT", body: JSON.stringify(payload) });
        await Swal.fire({
          icon: "success",
          title: "Pago aprobado",
          html: `<div>Comprobante: <b>${comprobante || "—"}</b></div>`,
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (e) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo confirmar la compra",
          text: "Revisá tu carrito.",
        });
      } finally {
        sessionStorage.removeItem("checkout");
        window.dispatchEvent(new Event("cart:refresh"));
        navigate(`${basedir}/productos`, { replace: true });
      }
    })();
  }, [navigate, basedir]);

  return null; // nada en pantalla (evita “Procesando…”)
}
