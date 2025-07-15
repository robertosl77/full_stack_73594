"use client";

import ModalCarrito from "../components/ModalCarrito";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";
import ProductosCard from "./ProductosCard";
import { esVista } from "../utils/tokenUtils";

const ProductosEstructura = ({ user, basedir }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const agregarAlCarrito = async (productoId, cantidad) => {
    if (!user) return;

    try {
      const res = await apiFetch(`/api/carrito`, {
        method: "POST",
        body: JSON.stringify({ productoId, cantidad }),
      });

      if (res.ok) {
        const cartRes = await apiFetch(`/api/carrito/cantidad`);
        const cartData = await cartRes.json();

        const cartWrapper = document.querySelector("#cart-wrapper");
        const cartCount = document.querySelector("#cart-count");

        if (cartWrapper) cartWrapper.style.display = "inline-block";
        if (cartCount) cartCount.textContent = cartData.cantidad;
      }
    } catch (error) {
      console.error("Fallo al agregar al carrito", error);
    }
  };

  const validarCantidad = (productoId, cantidad, max) => {
    const errorDiv = document.querySelector(`#error-stock-${productoId}`);
    if (cantidad < 1 || cantidad > max) {
      if (errorDiv) {
        errorDiv.textContent = `La cantidad debe estar entre 1 y ${max}.`;
        errorDiv.style.display = "block";
        setTimeout(() => (errorDiv.style.display = "none"), 3000);
      }
      return false;
    }
    if (errorDiv) errorDiv.style.display = "none";
    return true;
  };

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await apiFetch(`/api/productos`);
        const resData = await res;
        setProductos(resData.productos || []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [basedir]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const rolVista = esVista();

  return (
    <>
      <main className="container-fluid pt-5 mt-2 mb-5">
        <section className="container-sm mt-3">
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-3 mb-3">
            {/* Aquí irán los componentes individuales de tarjeta */}
            {productos.map(producto => (
              <div key={producto._id} className="col">
                {/* Componente ProductoCard irá acá */}

                <ProductosCard
                  producto={producto}
                  onAgregar={(id, cantidad) => {
                    if (validarCantidad(id, cantidad, producto.stock)) {
                      agregarAlCarrito(id, cantidad);
                    }
                  }}
                  esVista={rolVista}
                />

              </div>
            ))}
          </div>
        </section>
      </main>
      <ModalCarrito user={user} basedir={basedir} />
    </>
  );
};

export default ProductosEstructura;
