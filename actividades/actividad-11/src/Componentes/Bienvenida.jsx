import React, { useState } from "react";

function Bienvenida() {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [mostrarError, setMostrarError] = useState(false);
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const handleNombreChange = (e) => {
        setNombre(e.target.value);
        setMostrarMensaje(false);
        setMostrarError(false); 
    }
    const handleEdadChange = (e) => {
        // Solo permitir números
        const value = e.target.value.replace(/\D/, "");
        setEdad(value);
        setMostrarMensaje(false);
        setMostrarError(false); 
    };

    const handleMensaje = (nombre, edad) => {
        if (nombre && edad) {
            setMensaje(`Hola ${nombre}, tienes ${edad} años.`);
            setMostrarError(false);
            setMostrarMensaje(true);
        } else {
            setMensaje("Por favor, completa ambos campos.");
            setMostrarError(true);
            setMostrarMensaje(false);
        }        
    }

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
                    onClick={() => { handleMensaje(nombre, edad) }}
                >
                    Enviar Mensaje
                </button>

                {mostrarError && (
                <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
                    <div>{mensaje}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        aria-label="Close"
                        onClick={() => setMostrarError(false)}
                    />
                </div>
                )}

                {mostrarMensaje && (
                <div className="alert alert-info d-flex justify-content-between align-items-center" role="alert">
                    <div>{mensaje}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        aria-label="Close"
                        onClick={() => setMostrarMensaje(false)}
                    />
                </div>
                )}

            </div>
        </div>
    );
}

export default Bienvenida;