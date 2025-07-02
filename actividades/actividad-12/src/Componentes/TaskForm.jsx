import React, { useState } from "react";

function TaskForm({ agregarTarea }) {
    const [texto, setTexto] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (texto.trim() === "") return;
        agregarTarea(texto);
        setTexto("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nueva tarea..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <button className="btn btn-success" type="submit">
                    Agregar
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
