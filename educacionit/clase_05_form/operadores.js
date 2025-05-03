
let numeroUno = '50';
let numeroDos = '10';
let resultado;


//Concatena los valores de las variables
resultado = numeroUno + numeroDos; 

console.log("=======================================");

console.log(resultado);// 5010

console.log("=======================================");

// 1. Suma los valores de las variables
numeroUno = 50;
numeroDos = 10;

resultado = numeroUno + numeroDos;
console.log(resultado);// 60

console.log("=======================================");


// 2. Resta los valores de las variables
resultado = numeroUno - numeroDos;
console.log(resultado);// 40

console.log("=======================================");

// 3. Multiplica los valores de las variables
resultado = numeroUno * numeroDos;
console.log(resultado);// 500

console.log("=======================================");

//4. Divide los valores de las variables
resultado = numeroUno / numeroDos;
console.log(resultado);// 5

console.log("=======================================");

console.log("Hola gente de educacionIT");

// Cortamos la ejecución del programa con Crol + C 

// Crear una calculadora que sume, reste, multiplique y divida dos números

alert("Calculadora");

// creamos una variable que guarda datos del usuario
let datoUsuarioUno = prompt("Ingrese el primer número: ");

console.log("El valor del datoUsuarioUno es: " + datoUsuarioUno);

let datoUsuarioDos = prompt("Ingrese el segundo número: ");

console.log("El valor del datoUsuarioDos es: " + datoUsuarioDos);

//Usamos una función predefinida de JS para convertir el string a un número

//resultado = parseInt(datoUsuarioUno) + parseInt(datoUsuarioDos);


resultado = datoUsuarioUno + datoUsuarioDos;

parseInt(resultado);



console.log("El resultado de la suma es: " + resultado);

alert("El resultado de la suma es: " + resultado);


//La clase Math es una herramienta para realizar operaciones matemáticas avanzadas

let sorteo = Math.random();
console.log('El número del sorteo es: ' + sorteo);// sin el redondeo

sorteo = sorteo * 10;// obtenewmos un número entre 0 y 10	
console.log('El número del sorteo es: ' + sorteo);// sin el redondeo

//redondeamos el número
sorteo = Math.round(sorteo);
console.log('El número del sorteo es: ' + sorteo);


sorteo = Math.random();
sorteo = sorteo * 100; // obtenewmos un número entre 0 y 100
console.log('El número del sorteo es: ' + sorteo);


sorteo = Math.round(sorteo);
console.log('El número del sorteo es: ' + sorteo);














