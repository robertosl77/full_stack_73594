document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('formContacto');
  
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;

        if (!nombre || !email || !fechaNacimiento) {
            mostrarAlerta('Todos los campos son obligatorios.', 'warning');
            return;
        }

        const nuevoContacto = { nombre, email, fechaNacimiento };

        try {
            const response = await fetch('/tp9/alta_contactos', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoContacto)
        });

        const data = await response.json();

        if (response.ok) {
            mostrarAlerta('Contacto agregado con éxito.', 'success');
            formContacto.reset();
            setTimeout(() => {
              location.reload();
            }, 1500); // espera 1,5 segundos antes de recargar
        } else {
            if (data.error && data.error.includes('email')) {
                mostrarAlerta(data.error, 'warning');
            } else {
                mostrarAlerta('Error: ' + (data.error || 'Error desconocido.'), 'danger');
            }
        }

        } catch (error) {
            console.error('Error al agregar contacto:', error);
            mostrarAlerta('Error al conectar con el servidor.', 'secondary');
        }
    });

    cargarContactos();

    const inputBuscar = document.querySelector('input[type="search"]');
    inputBuscar.addEventListener('input', () => {
    filtrarContactos(inputBuscar.value.trim().toLowerCase());
});

});

function mostrarAlerta(mensaje, tipo = 'primary') {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
  
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
      </div>
    `;
  
    alertPlaceholder.innerHTML = ''; // Limpiamos cualquier alerta anterior
    alertPlaceholder.append(wrapper);
  
    // Eliminar la alerta automáticamente después de 3 segundos
    setTimeout(() => {
      wrapper.remove();
    }, 3000);
}
  
async function cargarContactos() {
    try {
      const response = await fetch('/tp9/listar_contactos');
      const contactos = await response.json();
  
      const divContactos = document.getElementById('divContactos');
      divContactos.innerHTML = '';
  
      contactos.forEach(contacto => {
        const { _id, nombre, email, fechaNacimiento } = contacto;
  
        const fila = document.createElement('div');
        fila.className = 'list-group-item';
  
        fila.innerHTML = `
          <div class="row align-items-center">
            <div class="col-md-3">${nombre}</div>
            <div class="col-md-3">${email}</div>
            <div class="col-md-2">${formatearFecha(fechaNacimiento)}</div>
            <div class="col-md-4 text-end">
              <button class="btn btn-sm btn-warning me-2 btn-editar" data-id="${_id}" data-nombre="${nombre}" data-email="${email}" data-fecha="${fechaNacimiento}">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button class="btn btn-sm btn-danger btn-eliminar" data-id="${_id}">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        `;
  
        divContactos.appendChild(fila);
      });

      localStorage.setItem('contactos', JSON.stringify(contactos));
      agregarEventosEliminar();
      agregarEventosEditar();
  
    } catch (error) {
      console.error('Error al cargar contactos:', error);
      mostrarAlerta('Error al cargar la lista de contactos.', 'secondary');
    }
}
    
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque en JS los meses empiezan en 0
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}
  
function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
  
    botonesEliminar.forEach(boton => {
      boton.addEventListener('click', (e) => {
        const id = boton.getAttribute('data-id');
  
        if (confirm('¿Estás seguro que quieres eliminar este contacto?')) {
          eliminarContacto(id); // separás la operación pesada
        }
      });
    });
}
  
async function eliminarContacto(id) {
    try {
      const response = await fetch(`/tp9/baja_contactos/${id}`, {
        method: 'DELETE'
      });
  
      const data = await response.json();
  
      if (response.ok) {
        mostrarAlerta('Contacto eliminado exitosamente.', 'success');
        cargarContactos();
      } else {
        mostrarAlerta('Error al eliminar contacto: ' + (data.error || 'Error desconocido.'), 'danger');
      }
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      mostrarAlerta('Error de conexión al eliminar.', 'secondary');
    }
}
  
function filtrarContactos(termino) {
    const filas = document.querySelectorAll('#divContactos .list-group-item');
  
    filas.forEach(fila => {
      const texto = fila.innerText.toLowerCase();
  
      if (texto.includes(termino)) {
        fila.style.display = '';
      } else {
        fila.style.display = 'none';
      }
    });
}  

function agregarEventosEditar() {
    const botonesEditar = document.querySelectorAll('.btn-editar');
  
    botonesEditar.forEach(boton => {
      boton.addEventListener('click', (e) => {
        const id = boton.getAttribute('data-id');
        const nombre = boton.getAttribute('data-nombre');
        const email = boton.getAttribute('data-email');
        const fechaNacimiento = boton.getAttribute('data-fecha').slice(0, 10); // Ajuste formato
  
        // Cargar valores en el form de editar
        document.getElementById('editarId').value = id;
        document.getElementById('editarNombre').value = nombre;
        document.getElementById('editarEmail').value = email;
        document.getElementById('editarFechaNacimiento').value = fechaNacimiento;
  
        // Mostrar el collapse de edición
        const collapseEditar = new bootstrap.Collapse('#editar_contactos', { toggle: true });
      });
    });
}  