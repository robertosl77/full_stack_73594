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

// Ejemplo de uso
async function main() {
    const numero = await pideNumero();
    console.log("Número ingresado: " + numero);
}

main();