function change_disabled(inputs, botones, estado){
    // Cambia el estado de los inputs
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = estado;
    }
    // Cambia el estado de los botones
    for (let i = 0; i < botones.length; i++) {
        botones[i].disabled = estado;
    }
    // Cambia el estado del div
    document.getElementById('destino').innerHTML = '';
}

function agregar_contenido(cant, valor) {
    console.log("dentro de agregar_contenido", cant, valor);
    let contenido = '';
    for (let i = 0; i < cant; i++) {
        contenido += valor;
    }
    document.getElementById('destino').innerHTML += contenido;
}

window.addEventListener('load', function() {
    // Ejercicio punto 2
    console.log('Contenido del DOM cargado');

    // Ejercicio punto 3
    const html = '<p>Este contenido <strong>está listo</strong><br>para ser editado y pasarlo abajo.</p>';
    const textarea = document.getElementById('origen');
    textarea.value = html;
    
    // Ejercicio punto 4
    const inputs = document.getElementsByTagName('input');
    const botones = document.getElementsByTagName('button');
    const habilitar = textarea.value.trim() !== '';

    change_disabled(inputs,botones, !habilitar);

    textarea.addEventListener('input', function() {
        const habilitar = textarea.value.trim() !== '';
        change_disabled(inputs,botones, !habilitar);
    });    

    // Ejercicio punto 5a - Botón Reemplazar
    document.getElementById('btn-reemplazar').addEventListener('click', function() {
        document.getElementById('destino').innerHTML = textarea.value;
    });

    // Ejercicio punto 5b - Botón Agregar
    const btnAgregar = document.getElementsByClassName('btn-agregar')[0];
    btnAgregar.addEventListener('click', function() {
        document.getElementById('destino').innerHTML += textarea.value;
    });

    // Ejercicio punto 5c - Botón Agregar 5 veces
    const btnAgregar5 = document.getElementsByClassName('btn-agregar')[1];
    btnAgregar5.addEventListener('click', function() {
        agregar_contenido(5, textarea.value);
    });

    // Ejercicio punto 5d - Botón Agregar 10 veces
    const btnAgregar10 = document.getElementsByClassName('btn-agregar')[2];
    btnAgregar10.addEventListener('click', function() {
        agregar_contenido(10, textarea.value);
    });    
    
    // Ejercicio punto 5e - Botón Agregar n veces
    const btnAgregarN = document.getElementsByClassName('btn-agregar')[3];
    btnAgregarN.addEventListener('click', function() {
        const cantidad = parseInt(prompt('¿Cuántas veces querés agregar el contenido?'), 10);
        if (!isNaN(cantidad) && cantidad > 0) {
            agregar_contenido(cantidad, textarea.value);
        } else {
            alert('Ingresá un número válido mayor que 0.');
        }
    });
    

});

