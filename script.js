
document.addEventListener("DOMContentLoaded", () => {
    const entradaTarea = document.getElementById("entradaTarea");
    const botonAgregar = document.getElementById("botonAgregar");
    const listaTareas = document.getElementById("listaTareas");
    const botonEliminarCompletadas = document.getElementById("botonEliminarCompletadas");
    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

    const guardarTareas = () => localStorage.setItem("tareas", JSON.stringify(tareas));

    const mostrarTareas = () => {
        listaTareas.innerHTML = "";
        tareas.forEach(({ id, texto, completada, creadaEn, completadaEn }) => {
            const elemento = document.createElement("li");
            elemento.classList.add("tarea-item");
            elemento.innerHTML = `
                <span class="tarea-texto ${completada ? 'completada' : ''}" data-id="${id}">${texto} (${new Date(creadaEn).toLocaleString()})</span>
                <button class="boton-alternar" data-id="${id}">${completada ? 'Desmarcar' : 'Completar'}</button>
                <button class="boton-eliminar" data-id="${id}">Eliminar</button>
            `;
            listaTareas.appendChild(elemento);
        });
    };

    botonAgregar.addEventListener("click", () => {
        const texto = entradaTarea.value.trim();
        if (!texto) return;
        const nuevaTarea = {
            id: Date.now(),
            texto,
            completada: false,
            creadaEn: new Date().toISOString(),
            completadaEn: null
        };
        tareas.push(nuevaTarea);
        guardarTareas();
        mostrarTareas();
        entradaTarea.value = "";
    });

    listaTareas.addEventListener("click", (evento) => {
        const id = Number(evento.target.dataset.id);
        if (evento.target.classList.contains("boton-alternar")) {
            tareas = tareas.map(tarea => tarea.id === id ? { 
                ...tarea, 
                completada: !tarea.completada, 
                completadaEn: tarea.completada ? null : new Date().toISOString()
            } : tarea);
        } else if (evento.target.classList.contains("boton-eliminar")) {
            tareas = tareas.filter(tarea => tarea.id !== id);
        }
        guardarTareas();
        mostrarTareas();
    });

    botonEliminarCompletadas.addEventListener("click", () => {
        tareas = tareas.filter(tarea => !tarea.completada);
        guardarTareas();
        mostrarTareas();
    });

    mostrarTareas();
});
