window.addEventListener('load', function() {
    // Ejercicio punto 2
    console.log('Contenido del DOM cargado');

    // Ejercicio punto 3
    const html = '<p>Este contenido <strong>está listo</strong><br>para ser editado y pasarlo abajo.</p>';
    const textarea = document.getElementById('origen');
    textarea.value = html;

    // Ejercicio punto 4
    if (textarea.value.trim() !== '') {
        // Habilitar botones al cargar si hay contenido
        const inputs = document.getElementsByTagName('input');
        const botones = document.getElementsByTagName('button');

        for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        }

        for (let i = 0; i < botones.length; i++) {
        botones[i].disabled = false;
        }
    }

    // También al escribir
    textarea.addEventListener('input', function() {
        const inputs = document.getElementsByTagName('input');
        const botones = document.getElementsByTagName('button');

        for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        }

        for (let i = 0; i < botones.length; i++) {
        botones[i].disabled = false;
        }
    });

});

