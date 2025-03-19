/*
// --FUNCION CLASICA------------------------------------------------
function saludarPersonaSimple(){
    alert("Hola sin variable!");
}

function saludarPersona(nombre){
    let color;

    if (boton.style.backgroundColor!=="red") {
        color = "green";
    } else {
        color = "red";
    }
    
    alert(`Hola ${nombre}!`);
    
}

// --FUNCION FLECHA------------------------------------------------

const saludarPersonaFlecha = () => {
    alert("Hola con Flecha!");
}
// --FUNCION CON ID------------------------------------------------
*/
//global
// let email;

// function saludarPersona(){
//     //local
//     let email = document.getElementById("email");
//     console.log(this.email);
//     console.log(email.value);
//     // console.log(email);
    
// }

function loginPersona(event){ //event: es para capturar el evento

    //local
    let email = document.getElementById("email").value;
    console.log(email);
}

let botonEnviar = document.getElementById("elemento");
console.log(1);
console.log(botonEnviar);
console.log(2);

//crea propia funcion
botonEnviar.addEventListener("click",function(e){
    console.log(e);
    e.preventDefault();
    
    let email = document.getElementById("email");
    // console.log(email);
    console.log(e.target.email.value);

});

//llama funcion existente
// botonEnviar.addEventListener("click",loginPersona);

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
