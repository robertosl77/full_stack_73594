


//Bucles = repeticiones de código hasta que se cumpla una condición

//Bucle for

//arreglos = índice 0      1      2       3        4     (n-1)
let nombres = ["Juan", "Pedro", "Ana", "Maria", "Jose"]; //string

console.log(nombres.length);

  //inicio                límite/condición       incremento
for(let inicio = 1; inicio < nombres.length; inicio++ ){
    console.log("El valor de la variables es " + nombres[inicio]);
}

let edad = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];  // number

console.log("=============================================");


//               0     1        2           3           4           5               6         n-1
let persona = ["Juan", 30, "Argentina", "Soltero", "Masculino", "Profesor", "Desarrollador"];

console.log(persona.length);


for(let i = 0; i < persona.length; i++){
  console.log(`Los datos de la persona son: ${i} : ${persona[i]}`);
  
}


console.log("La variable persona tiene los datos de: persona: " + persona);
console.log('La variable persona tiene los datos de: persona: ' + persona);
console.log(`La variable persona tiene los datos de: persona: ${persona}`);

console.log("=============================================");

let productos = ["Notebook", "Celular", "Tablet", "Smartwatch", "Cámara", "Impresora", "Monitor", "Teclado", "Mouse", "Parlantes"];

for (let i = 0; i < productos.length; i++) {
  console.log(`Los productos son: ${i} : ${productos[i]}`);
}

let nombre = "Juan";
console.log(`El nombre es: + nombre  ${nombre}`);

// arreglos => let dato = []
// objeto literal => let dato = {}

let dato = {
  //clave : valor
  nombre: "Juan",
  edad: 30,
  pais: "Brasil",
  estadoCivil: "Soltero",
  sexo: "Masculino",
  profesion: "Data Scientist",
  ocupacion: "Desarrollador",
}

console.log("=============================================");
console.log(dato);
console.log(dato.ocupacion);
console.log(dato.nombre);

console.log("=============================================");

let precios = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

let stock = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

for (let i = 0; i < productos.length; i++) {
  for (let i = 0; i < precios.length; i++) {
    console.log(`Los productos son: ${i} : ${productos[i]} y sus precios son: ${precios[i]}`);
  }
}

let producto = {
  nombre: "Notebook",
  precio: 1000,
  stock: 10,
  proveedor: "HP",
  categoria: "Tecnología",
}


{/* <h1>${producto.nombre}</h1>
<p>${producto.precio}</p>
<p>${producto.stock}</p>  
<button>Comprar/button> */}

let clientes = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

let cliente = {
  email: "pepe@gmail.com",
  password: "12345",
  nombre: "Pepe"
}


if(cliente.email === "pepe@gmail.com" && cliente.password === "12345"){
  console.log("Bienvenido a la tienda online");
}





