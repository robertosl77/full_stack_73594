window.onload = function() {
    // Código a ejecutar cuando se carga la página
    console.log('La página se ha cargado');
}


let formulario = document.getElementById('registroForm');

formulario.addEventListener('submit', function(e){

    // evitamos que se ejecute la función al cargar la página
    e.preventDefault();

    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let edad = document.getElementById('edad').value;
    let direccion = document.getElementById('direccion').value;
    let provincia = document.getElementById('provincia').value;

    // tomamos el valor del radio button seleccionado (femenino, masculino, otro)
    let genero = document.querySelector('input[name="genero"]:checked').value;


    // tomamos el valor del radio button seleccionado (femenino, masculino, otro)
    let generoSeleccionado;

    let generoFemenino = document.querySelector('#generoFemenino')
    let generoMasculino = document.querySelector('#generoMasculino')
    let generoOtro= document.querySelector('#generoOtro')

    if(generoFemenino.checked){
        generoSeleccionado = generoFemenino.value; 
        console.log(generoSeleccionado);
    }
    
    if(generoMasculino.checked){
        generoSeleccionado = generoMasculino.value;
        console.log(generoSeleccionado);
        
    }
    
    if(generoOtro.checked){
        generoSeleccionado = generoOtro.value;
        console.log(generoSeleccionado);
    }

    // tomamos los valores de los checkbox seleccionados
    let intereses = [];
    let interesesSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
    interesesSeleccionados.forEach(interes => {
        intereses.push(interes.value);
    });

    console.log(intereses); //array de intereses seleccionados

    let password = document.getElementById('password').value;


    let persona = {
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        direccion: direccion,
        provincia: provincia,
        generoSeleccionado: generoSeleccionado, //femenino, masculino, otro - de a un dato
        genero: genero,
        intereses: intereses, //array de intereses
        password: password
    }

    console.log(persona);

    formulario.reset();
    //limpiarDatos()

    // enviamos a la database el objeto persona
});

function limpiarDatos() {
    let nombre = document.getElementById('nombre').value = '';
    let apellido = document.getElementById('apellido').value = '';
    let edad = document.getElementById('edad').value = '';
    let direccion = document.getElementById('direccion').value = '';
    let provincia = document.getElementById('provincia').value = '';
    let generoFemenino = document.querySelector('#generoFemenino').checked = false;
    let generoMasculino = document.querySelector('#generoMasculino').checked = false;
    let generoOtro= document.querySelector('#generoOtro').checked = false;
    let password = document.getElementById('password').value = '';
}


//formulario.addEventListener('submit', registroPersona(e));
function registroPersona(e) {

    // Obtener los datos del formulario
    
}