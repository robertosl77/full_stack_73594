

//Login

let user;
let password;// mejor una longitud de 15 caracteres

// Variable con un patrón de password seguro
// 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;




user = 'pepes'
password = '12345Ma@'
let authCel = true;

// Validar el patrón de la contraseña
let valor = passwordPattern.test(password);

console.log(valor); // true


// && es el y lógico y ambas comparaciones deben ser verdaderas

// Validar el patrón de la contraseña
if (!passwordPattern.test(password)) {
    console.log('La contraseña no cumple con los requisitos de seguridad.');
} else {
    // && es el y lógico y ambas comparaciones deben ser verdaderas
    if (user == 'pepes' && authCel) {
        console.log('Bienvenido Administrador');
    } else {
        console.log('Usuario o contraseña incorrecta');
    }
}

console.log("==================================================");


// || es el o lógico y al menos una comparación debe ser verdadera

if(user == 'pepe' || password == '12345' && authCel){
    console.log('Bienvenido Administrador');  
    
}else{

    //if(){}

    console.log('Usuario o contraseña incorrecta');

}