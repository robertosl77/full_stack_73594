import React, { useState } from "react";

function Bienvenida() {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState(0);
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
        const value = e.target.value.replace(/\D/g, "");
        setEdad(value);
        setMostrarMensaje(false);
        setMostrarError(false); 
    };

    const handleMensaje = (nombre, edad) => {
        if (nombre && edad) {
            if (edad < 18) {
                setMensaje(`Hola ${nombre}, eres muy joven para usar esta aplicación`);
            } else {
                setMensaje(`Bienvenido ${nombre}, gracias por usar nuestra aplicación`);
            }

            setMostrarError(false);
            setMostrarMensaje(true);
        } else {
            setMensaje("Por favor, completa ambos campos.");
            setMostrarError(true);
            setMostrarMensaje(false);
        }        
    }

    return (
        <div className="container mt-5 p-4 bg-light rounded shadow-sm" style={{ maxWidth: '600px' }}>
            {/* Cabecera */}
            <div>
                <h1 className="text-center">Actividad #11</h1>
                <p className="mb-5">Por favor, ingresa tu nombre y edad:</p> 
            </div>
            {/* Formulario */}
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
                            min={0}
                            max={120}
                            value={edad}
                            onChange={handleEdadChange}
                        />              
                    </div>
                </div>

                <button 
                    type="button"
                    title="Enviar"
                    className="btn btn-primary"
                    onClick={() => { handleMensaje(nombre, edad) }}
                >
                    Enviar Mensaje
                </button>
            </div>
            {/* Mensajes */}
            <div className="row g-3 align-items-center ms-5 me-5 mt-5">
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