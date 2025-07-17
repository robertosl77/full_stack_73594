import { useState } from "react";
import { Offcanvas, Form, Button, Alert } from "react-bootstrap";
import { apiFetch } from "../utils/apiFetch";

const ModalEditarProducto = ({ producto, onClose }) => {
  const [precio, setPrecio] = useState(producto.precio_original);
  const [descuento, setDescuento] = useState(producto.descuento);
  const [stock, setStock] = useState(producto.stock);
  const [estado, setEstado] = useState(producto.estado);
  const [imagenFile, setImagenFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("precio_original", precio);
    formData.append("descuento", descuento);
    formData.append("stock", stock);
    formData.append("estado", estado);

    if (imagenFile) {
      if (!imagenFile.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen.");
        return;
      }
      formData.append("nuevaImagen", imagenFile);
    }

    try {
      const res = await apiFetch(`/api/admin/abmProductos/${producto._id}`, {
        method: "PUT",
        body: formData,
        headers: {}
      });

      if (res.ok) {
        setSuccess("Producto actualizado correctamente.");
        setTimeout(() => onClose(), 1500);
      } else {
        setError(res.error || "Error al guardar");
      }
    } catch (err) {
      setError("Error al guardar");
      console.error(err);
    }
  };

  return (
    <Offcanvas show onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Editar Producto</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleGuardar}>
          <div className="text-center mb-3">
            <img
              src={`/${producto.imagen}`}
              alt="Imagen actual"
              style={{ maxHeight: "120px" }}
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Imagen del producto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImagenFile(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control value={producto.nombre} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bodega</Form.Label>
            <Form.Control value={producto.bodega} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Control value={producto.tipo} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Original</Form.Label>
            <Form.Control
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descuento (%)</Form.Label>
            <Form.Control
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Habilitado"
            checked={estado}
            onChange={(e) => setEstado(e.target.checked)}
            className="mb-3"
          />

          <Button type="submit" variant="primary" className="w-100">
            Guardar Cambios
          </Button>

          {success && (
            <Alert variant="success" className="mt-3 text-center">
              {success}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="mt-3 text-center">
              {error}
            </Alert>
          )}
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ModalEditarProducto;
