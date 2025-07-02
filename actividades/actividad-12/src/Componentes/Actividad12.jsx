import React, { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

function Actividad12() {
    const [tareas, setTareas] = useState([]);

    const agregarTarea = (texto) => {
        const nuevaTarea = {
            id: Date.now(), // ID único basado en timestamp
            text: texto
        };
        setTareas([nuevaTarea, ...tareas]);
    };

    const eliminarTarea = (id) => {
        setTareas(tareas.filter((tarea) => tarea.id !== id));
    };

    return (
        <div className="container mt-5 p-4 bg-light rounded shadow-sm" style={{ maxWidth: '700px' }}>
            <h1 className="text-center mb-4">Actividad #12 - Lista de Tareas</h1>
            <TaskForm agregarTarea={agregarTarea} />
            <TaskList tareas={tareas} eliminarTarea={eliminarTarea} />
        </div>
    );
}

export default Actividad12;