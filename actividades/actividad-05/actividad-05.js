/**
 * Actividad 05: Emojis
 * Fecha: 12/02/2024
 * Autor: Roberto Sanchez Leiva
 */

function ejercicio1() {
    /**
     * Defino un vector donde carlo los emogies
     * cada emogie es seleccionado por el nombre de la variable mas su indice gato[0], gato[1], gato[2]
     * genero un bucle del 1 al 10 solo que arranca en 0 y termina en 9
     * dentro del bucle genero una variable modulo que es el indice del vector gato
     * es decir que obtengo el resto de la division cuyo resultado sera 0, 1 o 2 (los indices del vector)
     * imprimo el gato con el indice obtenido en el vector
     */
    let gato = ["😺", "😸", "😹"];
    console.log("--- Ejercicio 1 ---");
    for (let i = 0; i < 10; i++) {
        let modulo = i % 3;
        console.log(
            "Gato #" + (i + 1) + ": " +
            gato[modulo]
        );        
    }
}

function ejercicio2() {
    /**
     * Defino las variables gato y paso con los emojis correspondientes
     * genero dos numeros aleatorios entre 1 y 10 para que muestre diferentes cantidades de gatos y pasos
     * imprimo el ejercicio y la cantidad de gatos y pasos
     * genero un bucle para la cantidad de gatos
     * dentro de este bucle genero otro bucle para la cantidad de pasos
     * este bucle genera una cadena de pasos con la cantidad de pasos aleatorios
     * imprimo el gato y la cadena de pasos
     */
    let gato = "🐈";
    let paso = "🐾"
    let cantGatos = Math.floor(Math.random() * 10) + 1;
    let cantPasos = Math.floor(Math.random() * 10) + 1;
    console.log(
        "--- Ejercicio 2 ---" +
        "\nCantidad de gatos: " + cantGatos +
        "\nCantidad de pasos: " + cantPasos
    );
    for (let g = 0; g < cantGatos; g++) {
        let pasos = "";
        for (let p = 0; p < cantPasos; p++) {
            pasos += paso;
        }
        console.log(`Gato #${g + 1}: ${gato} ${pasos}`);
    }
}

function ejercicio3() {
    /**
     * Idem ejercicio 2 pero con un gato colado
     * es decir defino un segundo emoji para el gato colado
     * alfinal del bucle de gatos imprimo el gato colado si el indice es par
     * de lo contrario imprimo el gato normal
     * esto se analiza a través del operador modulo que dividido por 2 me da 0 o 1
     */
    let gato = "🐈";
    let gatoColado = "🐈‍⬛";
    let paso = "🐾"
    let cantGatos = Math.floor(Math.random() * 10) + 1;
    let cantPasos = Math.floor(Math.random() * 10) + 1;
    console.log(
        "--- Ejercicio 3 ---" +
        "\nCantidad de gatos: " + cantGatos +
        "\nCantidad de pasos: " + cantPasos
    );
    for (let g = 0; g < cantGatos; g++) {
        let pasos = "";
        for (let p = 0; p < cantPasos; p++) {
            pasos += paso;
            
        }
        console.log(`Gato #${g + 1}: ${(g%2===0 ? gato : gatoColado)} ${pasos}`);
    }
}

/**
 * Ejecuto los ejercicios
 */
ejercicio1();
ejercicio2();
ejercicio3();