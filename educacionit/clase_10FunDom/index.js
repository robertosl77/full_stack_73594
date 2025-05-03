
// funciones: son pequeñas porciones de código que se pueden reutilizar en distintas partes de nuestro programa.



//ES6: función flecha
//const saludarPersona = () => {}

    // global
    //let email = document.getElementById("email").value;

    
    //ES5: función nativa
    function loginPersona() {
        
        // local
        let email = document.getElementById("email").value;
        
        console.log(email);
        

    }


let botonEnviar = document.getElementById("elemento");
console.log(botonEnviar);



botonEnviar.addEventListener("click", function(e){
    console.log(e);

    //evento.preventDefault();

    //let email = evento.target.email.value


   // console.log(email);
    
    
})

// botonEnviar.addEventListener("click", loginPersona)

let persona ={
    nombre: "Juan",
    apellido: "Perez",
    edad: 25,
    email: "pepe@gmail.com"
}

console.log(persona.email);

console.log(window);

