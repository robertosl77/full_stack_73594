import React, { useState } from "react";

function Bienvenida() {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleNombreChange = (e) => {
        setNombre(e.target.value);
    }
    const handleEdadChange = (e) => {
        // Solo permitir números
        const value = e.target.value.replace(/\D/, "");
        setEdad(value);
    };

    return (
        <div className="container">
            <div>
                <h1 className="text-center">Bienvenido</h1>
                <p className="mb-5">Por favor, ingresa tu nombre y edad:</p> 
            </div>

            <div className="row g-3 align-items-center ms-5 me-5">

                <div className="mb-3 row">
                    <label htmlFor="imputNombre" className="col-sm-2 col-form-label">Nombre</label>
                    <div className="col-sm-10">
                        <input
                            id="inputNombre"
                            type="text"
                            className="form-control"                    
                            value={nombre}
                            onChange={handleNombreChange}
                            placeholder="Escribe tu nombre"
                        />                    
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="inputEdad" className="col-sm-2 col-form-label">Edad</label>
                    <div className="col-sm-10">
                        <input
                            id="inputEdad"
                            type="number"
                            className="form-control"
                            value={edad}
                            onChange={handleEdadChange}
                            placeholder="Escribe tu edad"
                            min="0"
                        />    
                        <input 
                            type="range" 
                            className="form-range" 
                            id="inputEdad"
                            min={0}
                            max={120}
                            onChange={handleEdadChange}
                        />              
                    </div>
                </div>

                <button 
                    type="button"
                    title="Enviar"
                    onClick={() => {
                        if (nombre && edad) {
                            setMensaje(`Hola ${nombre}, tienes ${edad} años.`);
                        } else {
                            setMensaje("Por favor, completa ambos campos.");
                        }
                    }}
                    
                >
                    Enviar Mensaje
                </button>

                <div>
                    {mensaje && <p>{mensaje}</p>}
                </div>            
            </div>
        </div>
    );
}

export default Bienvenida;