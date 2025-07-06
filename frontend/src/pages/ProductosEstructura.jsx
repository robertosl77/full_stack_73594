"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalCarrito from "../components/ModalCarrito";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";
import ProductosCard from "./ProductosCard";

const ProductosEstructura = ({ user, basedir }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Header user={user} />
      <main className="container-fluid pt-5 mt-4">
        <section className="container-sm mt-3">
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-3 mb-3">
            {/* Aquí irán los componentes individuales de tarjeta */}
            {productos.map(producto => (
              <div key={producto._id} className="col">
                {/* Componente ProductoCard irá acá */}
                <ProductosCard producto={producto} onAgregar={onAgregar} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <ModalCarrito user={user} basedir={basedir} />
      <Footer />
    </>
  );
};

export default ProductosEstructura;
