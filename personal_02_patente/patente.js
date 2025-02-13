function bienvenida(){
    console.log(
        "#########################################\n" +
        "--- Bienvenido al juego de la patente ---\n" +
        "#########################################\n" 
    );
}

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

function validaNumero(){
    let numero = 0;
    let resultado = true;
    do {
        numero = pideNumero();
        console.log("pre validacion: "+numero);
        if (!isNaN(numero)) {
            resultado = false;
        } else if (!Number.isInteger(Number(numero))) {
            resultado = false;
        } else if (numero.length < 0) {
            resultado = false;
        }
    } while (resultado);
    
    return numero;
}

// Ejemplo de uso
async function main() {
    bienvenida();
    const numero = await validaNumero();
    console.log("Número ingresado: " + numero);
}

main();