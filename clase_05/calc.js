const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Ingresa el primer número: ", (num1) => {
    rl.question("Ingresa una operación (+, -, *, /): ", (operacion) => {
        rl.question("Ingresa el segundo número: ", (num2) => {
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
            
            let resultado;
            switch (operacion) {
                case '+': resultado = num1 + num2; break;
                case '-': resultado = num1 - num2; break;
                case '*': resultado = num1 * num2; break;
                case '/': 
                    resultado = num2 !== 0 ? num1 / num2 : "Error: División por cero"; 
                    break;
                default: 
                    resultado = "Operación no válida";
            }
            
            console.log(`Resultado: ${resultado}`);
            rl.close();
        });
    });
});
