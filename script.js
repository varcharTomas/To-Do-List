document.addEventListener("DOMContentLoaded", () => {
    const entradaTarea = document.getElementById("entradaTarea");
    const botonAgregar = document.getElementById("botonAgregar");
    const listaTareas = document.getElementById("listaTareas");
    const botonLimpiarCompletadas = document.getElementById("botonLimpiarCompletadas");
    const botonFiltro = document.getElementById("botonFiltro");
    const infoRapida = document.getElementById("infoRapida");

    let tareas = obtenerTareasDesdeStorage();
    let filtroActual = "todas";

    function guardarTareasEnStorage() {
        localStorage.setItem("tareas", tareas.map(t => Object.values(t).join("| ")).join("\n"));
    }

    function obtenerTareasDesdeStorage() {
        const data = localStorage.getItem("tareas");
        if (!data) return [];
        return data.split("\n").map(linea => {
            const [id, texto, completada, creada, completadaEn] = linea.split("| ");
            return {
                id: Number(id),
                texto,
                completada: completada === "true",
                creada,
                completadaEn: completadaEn === "null" ? null : completadaEn
            };
        });
    }

    function mostrarTaread() {
        listaTareas.innerHTML = "";
        const tareasFiltradas = tareas.filter(t => {
            if (filtroActual === "todas") return true;
            if (filtroActual === "completadas") return t.completada;
            if (filtroActual === "pendientes") return !t.completada;
        });
        tareasFiltradas.forEach(({ id, texto, completada, creada }) => {
            const li = document.createElement("li");
            li.classList.add("tarea-item");
            li.innerHTML = `
                <span class="tarea-texto ${completada ? 'completada' : ''}" data-id="${id}">${texto} (${new Date(creada).toLocaleString()})</span>
                <button class="boton-alternar" data-id="${id}">${completada ? 'Desmarcar' : 'Completar'}</button>
                <button class="boton-eliminar" data-id="${id}">Eliminar</button>
            `;
            listaTareas.appendChild(li);
        });
    }

    botonAgregar.addEventListener("click", () => {
        const texto = entradaTarea.value.trim();
        if (!texto) return;
        const nuevaTarea = {
            id: Date.now(),
            texto,
            completada: false,
            creada: new Date().toISOString(),
            completadaEn: null
        };
        tareas.push(nuevaTarea);
        guardarTareasEnStorage();
        mostrarTaread();
        entradaTarea.value = "";
        mostrarTareaMasRapida();
    });

    listaTareas.addEventListener("click", (evento) => {
        const id = Number(evento.target.dataset.id);
        if (evento.target.classList.contains("boton-alternar")) {
            tareas = tareas.map(t => t.id === id ? {
                ...t,
                completada: !t.completada,
                completadaEn: t.completada ? null : new Date().toISOString()
            } : t);
        } else if (evento.target.classList.contains("boton-eliminar")) {
            tareas = tareas.filter(t => t.id !== id);
        }
        guardarTareasEnStorage();
        mostrarTaread();
        mostrarTareaMasRapida();
    });

    botonLimpiarCompletadas.addEventListener("click", () => {
        tareas = tareas.filter(t => !t.completada);
        guardarTareasEnStorage();
        mostrarTaread();
        mostrarTareaMasRapida();
    });

    botonFiltro.addEventListener("click", () => {
        if (filtroActual === "todas") filtroActual = "pendientes";
        else if (filtroActual === "pendientes") filtroActual = "completadas";
        else filtroActual = "todas";
        botonFiltro.textContent = `Filtro: ${filtroActual}`;
        mostrarTaread();
    });

    function mostrarTareaMasRapida() {
        const completadas = tareas.filter(t => t.completada && t.completadaEn);
        if (completadas.length === 0) {
            infoRapida.textContent = "";
            return;
        }
        const masRapida = completadas.reduce((prev, curr) => {
            const tiempoPrev = new Date(prev.completadaEn) - new Date(prev.creada);
            const tiempoCurr = new Date(curr.completadaEn) - new Date(curr.creada);
            return tiempoCurr < tiempoPrev ? curr : prev;
        });
        const duracion = (new Date(masRapida.completadaEn) - new Date(masRapida.creada)) / 1000;
        infoRapida.textContent = `Más rápida: "${masRapida.texto}" en ${duracion} segundos.`;
    }

    mostrarTaread();
    mostrarTareaMasRapida();
});
