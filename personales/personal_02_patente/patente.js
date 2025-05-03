function pideNumero() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question("Ingrese un número entero mayor o igual que cero: ", (numero) => {
            rl.close();
            resolve(numero);
        });
    });
}
function validaNumero(numero){
    let resultado = true;

    if (isNaN(numero)) {
        console.log("No es un número");
        resultado = false;
    } else if (!Number.isInteger(Number(numero))) {
        console.log("No es un número entero");
        resultado = false;
    } else if (numero < 0) {
        console.log("No es un número mayor o igual que cero");
        resultado = false;
    } else if (numero.length === 0) {
        console.log("No ingreso ningun número");
        resultado = false;
    }
    
    return resultado;
}
function obtienePatente(numero){
    const contadorNumerico = numero % 1000;
    let letras = Math.floor(numero / 1000);

    const c = String.fromCharCode(65 + (letras % 26));
    letras = Math.floor(letras / 26);
    const b = String.fromCharCode(65 + (letras % 26));
    letras = Math.floor(letras / 26);
    const a = String.fromCharCode(65 + (letras % 26));

    const patente = `${a}${b}${c} ${contadorNumerico.toString().padStart(3, '0')}`;
    return patente;
}

// Ejemplo de uso
async function main() {
    console.log(
        "#########################################\n" +
        "--- Bienvenido al juego de la patente ---\n" +
        "#########################################\n" 
    );
    let numero = 0;
    while (true) {
        do {
            numero = await pideNumero();
        } while (!validaNumero(numero));
    
        console.log(obtienePatente(numero));            
    }
}

main();