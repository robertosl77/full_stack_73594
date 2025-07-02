import React from "react";

function TaskList({ tareas, eliminarTarea }) {
    return (
        <ul className="list-group">
            {tareas.length === 0 ? (
                <li className="list-group-item text-muted text-center">No hay tareas agregadas</li>
            ) : (
                tareas.map((tarea) => (
                    <li key={tarea.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {tarea.text}
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => eliminarTarea(tarea.id)}
                        >
                            Eliminar
                        </button>
                    </li>
                ))
            )}
        </ul>
    );
}

export default TaskList;
