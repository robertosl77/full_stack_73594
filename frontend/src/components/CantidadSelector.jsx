import React, { useState } from "react";
import { Button, InputGroup, Input } from "reactstrap";
import { apiFetch } from "../utils/apiFetch";

const CantidadSelector = ({ cantidad, stock, productoId, usuarioId, onCambio }) => {
  const [valor, setValor] = useState(cantidad);
  const [actualizando, setActualizando] = useState(false);

  const actualizarCantidad = async (nuevaCantidad) => {
    if (nuevaCantidad < 1 || nuevaCantidad > stock || nuevaCantidad === valor) return;

    setActualizando(true);
    try {
      const res = await apiFetch("/api/carrito/cantidad", {
        method: "PUT",
        body: JSON.stringify({
          usuarioId,
          productoId,
          cantidad: nuevaCantidad,
        }),
      });

      if (res.success) {
        setValor(nuevaCantidad);
        onCambio(nuevaCantidad);
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    } finally {
      setActualizando(false);
    }
  };

  return (
    <InputGroup size="sm" className="cantidad-selector w-100">
      <Button
        color="secondary"
        outline
        disabled={valor <= 1 || actualizando}
        onClick={() => actualizarCantidad(valor > stock ? stock : valor - 1)}
        className="cantidad-selector-btn"
      >
        −
      </Button>
      <Input
        value={valor}
        disabled
        className="cantidad-selector-input text-center bg-white"
        style={{ width: "3rem" }} // Maintain a minimum width for the input
      />
      <Button
        color="secondary"
        outline
        disabled={valor >= stock || actualizando}
        onClick={() => actualizarCantidad(valor + 1)}
        className="cantidad-selector-btn"
      >
        +
      </Button>
    </InputGroup>
  );
};

export default CantidadSelector;