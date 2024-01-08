// Variables
const color = document.querySelector("#color");
const ancho = document.querySelector("#ancho");
const limpiar = document.querySelector("#limpiar");
const canvas = document.querySelector("#canvas");
const contexto = canvas.getContext("2d");

let ruta = false;
let x, y;

// Event Listener
eventList();

function eventList() {
    // Eventos para dispositivos táctiles
    canvas.addEventListener("touchstart", function (e) {
        ruta = true;
        x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        contexto.beginPath();
        contexto.moveTo(x, y);
    });

    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        if (ruta == true) {
            x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
            y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
            contexto.lineTo(x, y);
            contexto.stroke();
        }
    });

    canvas.addEventListener("touchend", function () {
        ruta = false;
    });

    // Eventos para dispositivos con ratón
    canvas.addEventListener("mousedown", function (e) {
        ruta = true;
        x = e.clientX - canvas.getBoundingClientRect().left;
        y = e.clientY - canvas.getBoundingClientRect().top;
        contexto.beginPath();
        contexto.moveTo(x, y);
    });

    canvas.addEventListener("mousemove", function (e) {
        if (ruta == true) {
            x = e.clientX - canvas.getBoundingClientRect().left;
            y = e.clientY - canvas.getBoundingClientRect().top;
            contexto.lineTo(x, y);
            contexto.stroke();
        }
    });

    canvas.addEventListener("mouseup", function () {
        ruta = false;
    });

    color.addEventListener("change", colorLinea);
    ancho.addEventListener("change", anchoLinea);
    limpiar.addEventListener("click", limpiarCanvas);
}

contexto.lineWidth = 1;

function colorLinea() {
    contexto.strokeStyle = color.value;
}

function anchoLinea() {
    contexto.lineWidth = ancho.value;
    document.getElementById("valor").innerHTML = ancho.value;
}

function limpiarCanvas() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}
