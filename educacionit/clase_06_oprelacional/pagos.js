

//Simulamos una compra en una tienda online


let saldo;
let pagoCarrito;
let cantidadCompras = 0;
let totalCompras = 0;

saldo = 10000; //cuenta bancaria

pagoCarrito = 1500; //compra

//Pago de la compra
if(saldo >= pagoCarrito){
    console.log("Aprobado");// confirmación de pago
    saldo = saldo - pagoCarrito//descontar el pago del saldo
    console.log("Saldo actual: " + saldo);
    //cantidadCompras = cantidadCompras + 1; //contador de compras
    totalCompras = pagoCarrito
    console.log("Total de compras: " + totalCompras);
    
    cantidadCompras += 1; //operador de incremento

    console.log("Cantidad de productos: " + cantidadCompras);
}else{
    console.log("Saldo insuficiente");
    console.log("Saldo actual: " + saldo);
}







//undefined
//null
//NaN

