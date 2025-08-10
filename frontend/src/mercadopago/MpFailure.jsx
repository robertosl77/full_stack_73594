// src/mercadopago/MpFailure.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MpFailure() {
  const navigate = useNavigate();
  const basedir = process.env.REACT_APP_BASEDIR ? `/${process.env.REACT_APP_BASEDIR}` : "";

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const raw = (q.get("status") || q.get("collection_status") || "").toLowerCase();
    const status = (!raw || raw === "null") ? "canceled" : raw;

    sessionStorage.removeItem("checkout");

    let title = "Operación no completada";
    let text = "Tu pago no se pudo completar.";
    if (status === "canceled") {
      title = "Pago cancelado";
      text = "Cancelaste el pago o volviste sin completarlo.";
    } else if (status === "rejected") {
      title = "Pago rechazado";
      text = "El medio de pago rechazó la operación.";
    } else if (status === "in_process" || status === "pending") {
      title = "Pago en revisión";
      text = "La operación quedó pendiente de validación.";
    }

    Swal.fire({
      icon: "info",
      title,
      text,
      confirmButtonText: "Volver"
    }).then(() => {
      window.dispatchEvent(new Event("cart:refresh"));
      navigate(`${basedir}/productos`, { replace: true });
    });
  }, [navigate, basedir]);

  return null;
}
