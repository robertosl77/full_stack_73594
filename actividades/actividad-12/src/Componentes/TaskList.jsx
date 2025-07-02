import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TaskList({ tareas, setTareas, eliminarTarea }) {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return; // Si no hay destino, no hacer nada

    const items = [...tareas]; // Copia inmutable del arreglo
    const [reordenado] = items.splice(result.source.index, 1); // Extraer la tarea arrastrada
    items.splice(result.destination.index, 0, reordenado); // Insertar en la nueva posición

    setTareas(items); // Actualizar el estado
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tareas">
        {(provided) => (
          <ul
            className="list-group"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ minHeight: "100px" }} // Asegura que la lista sea droppable
          >
            {tareas.map((tarea, index) => (
              <Draggable
                key={tarea.id.toString()} // Asegura que key sea una cadena única
                draggableId={tarea.id.toString()} // Asegura que draggableId sea único
                index={index}
              >
                {(provided, snapshot) => (
                  <li
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      snapshot.isDragging ? "dragging" : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      userSelect: "none", // Evita selección de texto durante arrastre
                    }}
                  >
                    <div>
                      <span className="badge bg-secondary me-2">{index + 1}</span>
                      {tarea.text}
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminarTarea(tarea.id)}
                    >
                      Eliminar
                    </button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {tareas.length === 0 && (
              <li className="list-group-item text-muted text-center">
                No hay tareas agregadas
              </li>
            )}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskList;