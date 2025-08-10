import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

export default function MpSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const status = q.get("status") || q.get("collection_status");
    const checkout = sessionStorage.getItem("checkout");

    if (status !== "approved" || !checkout) {
      sessionStorage.removeItem("checkout");
      navigate("/integrador3/productos?cart=1", { replace: true });
      return;
    }

    (async () => {
      try {
        const payload = JSON.parse(checkout);
        await apiFetch("/api/carrito/comprar", {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Error al confirmar compra tras pago:", err);
      } finally {
        sessionStorage.removeItem("checkout");
        navigate("/integrador3/productos?cart=1", { replace: true });
      }
    })();
  }, [navigate]);

  return <p>Procesando pago...</p>;
}
