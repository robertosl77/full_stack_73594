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
  
  

