function ejercicio1() {
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

ejercicio1();
ejercicio2();
ejercicio3();