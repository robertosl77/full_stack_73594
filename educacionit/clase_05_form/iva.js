
/* 
Las variables que son constantes se deben declarar y asignar 
una sóla vez a pesar de tener varios archivos JS
 */

const IVA = 50;
console.log("el iva del archivo iva.js es " + IVA); //crachea porque IVA ya fue declarado en el archivo formulario.js

console.log("sigo después del iva"); //esto ya no se impreme porque crachea antes



console.log("Hola mundo");