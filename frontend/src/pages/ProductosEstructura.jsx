import ProductosCard from "./ProductosCard";
import { esVista } from "../utils/tokenUtils";
import { apiFetch } from "../utils/apiFetch";

const ProductosEstructura = ({ user, basedir, setCantidadCarrito, productos, actualizarStock }) => {
  const agregarAlCarrito = async (productoId, cantidad) => {
    if (!user) return;

    try {
      const res = await apiFetch(`/api/carrito`, {
        method: "POST",
        body: JSON.stringify({ productoId, cantidad }),
      });

      if (res.status === 200) {
        const data = await res;
        actualizarStock(productoId, data.stockActual); // Actualizamos el stock
        if (data.cantidadCarrito !== undefined) {
          setCantidadCarrito(data.cantidadCarrito);
        }
      }
    } catch (error) {
      console.error("Fallo al agregar al carrito", error);
    }
  };

  const rolVista = esVista();

  return (
    <>
      <main className="container-fluid pt-5 mt-2 mb-5">
        <section className="container-sm mt-3">
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-3 mb-3">
            {productos.map((producto) => (
              <div key={producto._id} className="col">
                <ProductosCard
                  producto={producto}
                  onAgregar={(id, cantidad) => agregarAlCarrito(id, cantidad)}
                  esVista={rolVista}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductosEstructura;