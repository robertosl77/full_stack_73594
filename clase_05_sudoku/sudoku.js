function crearSudoku() {
    const tablero = Array(9).fill().map(() => Array(9).fill(0));

    function esValido(fila, col, num) {
        // Verificar fila
        for (let i = 0; i < 9; i++) {
            if (tablero[fila][i] === num) return false;
        }

        // Verificar columna
        for (let i = 0; i < 9; i++) {
            if (tablero[i][col] === num) return false;
        }

        // Verificar cuadrante 3x3
        let inicioFila = Math.floor(fila / 3) * 3;
        let inicioCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (tablero[inicioFila + i][inicioCol + j] === num) return false;
            }
        }

        return true;
    }

    function llenarTablero(fila, col) {
        if (fila === 9) return true; // Tablero lleno

        // Mover a la siguiente columna o fila
        let siguienteFila = col === 8 ? fila + 1 : fila;
        let siguienteCol = (col + 1) % 9;

        // Intentar colocar un número en la celda
        let numeros = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        for (let num of numeros) {
            if (esValido(fila, col, num)) {
                tablero[fila][col] = num;
                if (llenarTablero(siguienteFila, siguienteCol)) return true;
                tablero[fila][col] = 0; // Backtrack si no funciona
            }
        }

        return false;
    }

    llenarTablero(0, 0);
    return tablero;
}

// Generar Sudoku y mostrarlo en consola
const sudoku = crearSudoku();
sudoku.forEach(row => console.log(row.join(" ")));
