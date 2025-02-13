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
    return "AAA 000";
}

// Ejemplo de uso
async function main() {
    bienvenida();
    let numero = 0;
    do {
        numero = await pideNumero();
    } while (!validaNumero(numero));

    console.log(obtienePatente(numero));
}

main();