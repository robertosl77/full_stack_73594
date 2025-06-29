document.addEventListener('DOMContentLoaded', () => {
  const filas = document.querySelectorAll('.fila-producto');
  const offcanvas = new bootstrap.Offcanvas('#offcanvasProducto');

  filas.forEach(fila => {
    fila.addEventListener('click', () => {
      // Obtener datos desde atributos data-*
      const id = fila.dataset.productoId;
      const nombre = fila.dataset.nombre;
      const bodega = fila.dataset.bodega;
      const tipo = fila.dataset.tipo;
      const imagen = fila.dataset.imagen;
      const precio = fila.dataset.precio;
      const descuento = fila.dataset.descuento;
      const stock = fila.dataset.stock;
      const estado = fila.dataset.estado === 'true';

      // Cargar datos en el formulario
      document.getElementById('productoId').value = id;
      document.getElementById('productoImagen').src = '/' + imagen;
      document.getElementById('productoNombre').value = nombre;
      document.getElementById('productoBodega').value = bodega;
      document.getElementById('productoTipo').value = tipo;
      document.getElementById('productoPrecio').value = precio;
      document.getElementById('productoDescuento').value = descuento;
      document.getElementById('productoStock').value = stock;
      document.getElementById('productoEstado').checked = estado;

      // Mostrar el offcanvas
      offcanvas.show();
    });
  });
});


document.getElementById('nuevaImagen').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const alertBox = document.getElementById('imagenErrorABM');

  if (file && !allowedTypes.includes(file.type)) {
    alertBox.style.display = 'block';
    event.target.value = '';
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 3000);
  } else {
    alertBox.style.display = 'none';
  }
});
