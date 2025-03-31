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

    // Ejercicio punto 5 - Botón Reemplazar
    document.getElementById('btn-reemplazar').addEventListener('click', function() {
        document.getElementById('destino').innerHTML = textarea.value;
    });

    // Ejercicio punto 6 - Botón Agregar
    const btnAgregar = document.getElementsByClassName('btn-agregar')[0];
    btnAgregar.addEventListener('click', function() {
        document.getElementById('destino').innerHTML += textarea.value;
    });

});

