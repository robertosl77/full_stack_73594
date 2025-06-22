import React, { useState } from "react";

function Bienvenida() {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");

    const handleNombreChange = (e) => setNombre(e.target.value);
    const handleEdadChange = (e) => {
        // Solo permitir números
        const value = e.target.value.replace(/\D/, "");
        console.log(value);
        setEdad(value);
    };

    return (
        <div>
            <label>
                Nombre:
                <input
                    type="text"
                    value={nombre}
                    onChange={handleNombreChange}
                    placeholder="Escribe tu nombre"
                />
            </label>
            <br />
            <label>
                Edad:
                <input
                    type="number"
                    value={edad}
                    onChange={handleEdadChange}
                    placeholder="Escribe tu edad"
                    min="0"
                />
            </label>
        </div>
    );
}

export default Bienvenida;