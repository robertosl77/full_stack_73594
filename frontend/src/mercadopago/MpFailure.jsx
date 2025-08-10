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
    if (status === "canceled") title = "Pago cancelado";
    else if (status === "rejected") title = "Pago rechazado";
    else if (status === "in_process" || status === "pending") title = "Pago en revisión";

    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "info",
      title,
      showConfirmButton: false,
      timer: 2600,
      timerProgressBar: true,
    });

    window.dispatchEvent(new Event("cart:refresh"));
    navigate(`${basedir}/productos`, { replace: true });
  }, [navigate, basedir]);

  return null;
}
