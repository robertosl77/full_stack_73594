

//Operadores relacionales
/*
= -> Asignación
== -> Igualdad
=== -> Igualdad estricta
!= -> Diferente
!== -> Diferente estricto
> -> Mayor que
< -> Menor que
>= -> Mayor o igual que
<= -> Menor o igual que
*/

let pasaporte = false; //valor booleano
let pasaje = false; //valor booleano


// Condicional if = si()
if(pasaporte){
    console.log("Ciudadano habilitado para viajar");
}

let edad = 18

if(edad == 21){
    console.log('Puede ingresar a la fiesta');
    console.log("color verde");
}

//else = sino
if(pasaporte){
    console.log("Ciudadano habilitado para viajar");
}else{
    console.log("No tienes Pasaporte, Ciudadano no habilitado para viajar");
}


if(edad > 21){
    console.log('Tienes 21 años, Puede ingresar a la fiesta');
    console.log("color verde");
}else{
    console.log('No puede ingresar a la fiesta');
    console.log("color rojo");
}


console.log('===================================================');
console.log('===================================================');

/*
!= -> Diferente
!== -> Diferente estricto
*/

let carrito = 10;
let totalCompras = 3000;

if(carrito === '10'){
    console.log('El carrito tiene productos');
}


