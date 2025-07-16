// src/components/ModalEditarProducto.jsx
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEditarProducto = ({ producto, onClose }) => {
  const [formData, setFormData] = useState({
    _id: "",
    nombre: "",
    bodega: "",
    tipo: "",
    precio_original: 0,
    descuento: 0,
    stock: 0,
    estado: false,
    imagen: "",
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        _id: producto._id,
        nombre: producto.nombre,
        bodega: producto.bodega,
        tipo: producto.tipo,
        precio_original: producto.precio_original,
        descuento: producto.descuento,
        stock: producto.stock,
        estado: producto.estado,
        imagen: producto.imagen,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, nuevaImagen: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviar datos:", formData);
    // TODO: Enviar datos al backend para guardar cambios
    onClose();
  };

  return (
    <Modal show onHide={onClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          <div className="text-center mb-3">
            <img
              src={`/${formData.imagen}`}
              alt="imagen actual"
              style={{ maxHeight: "120px" }}
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Imagen del producto</Form.Label>
            <Form.Control
              type="file"
              name="nuevaImagen"
              accept="image/*"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bodega</Form.Label>
            <Form.Control
              type="text"
              name="bodega"
              value={formData.bodega}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              name="tipo"
              value={formData.tipo}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Original</Form.Label>
            <Form.Control
              type="number"
              name="precio_original"
              value={formData.precio_original}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descuento (%)</Form.Label>
            <Form.Control
              type="number"
              name="descuento"
              value={formData.descuento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            name="estado"
            label="Habilitado"
            checked={formData.estado}
            onChange={handleChange}
          />

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </div>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditarProducto;
