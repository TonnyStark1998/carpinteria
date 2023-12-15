import { obtenerDirectorio, getFileDataSKP, getFileData } from './ajaxModule.js';
import  init3DModelViewer  from './3DModelViewer.js';

// var rutaViewDataInput;
obtenerDirectorio().then((data) => {
    var tbody = document.getElementById('table_body');
    tbody.innerHTML = '';

    var i = 0;
    data["file_list"].forEach(function (file) {

        var fila = tbody.insertRow(i);
        var celda1 = fila.insertCell(0);
        celda1.innerHTML = i;

        var celda2 = fila.insertCell(1);
        var icon = (file["type"] != 'file') ? '<i class="fas fa-folder icono-carpeta"></i>' : '<i class="fa fa-file icono-archivo" aria-hidden="true"></i>';
        celda2.innerHTML = icon;

        var celda3 = fila.insertCell(2);
        celda3.innerHTML = file["file"];

        var celda4 = fila.insertCell(3);
        celda4.innerHTML = (file["ext"] == -1 && file["type"] == 'file') ? '<span title="No disponible" class="badge bg-danger">No disponible</span>' :
            '<span title="Disponible" class="badge bg-success">Disponible</span>';

        var celda5 = fila.insertCell(4);
        var fun_type = '<button type="button" class="btn btn-block bg-gradient-danger btn-xs" disabled>No disponible</button>';
        if (file["ext"] == 'SKP') {
            fun_type = '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="ver_archivo_SKP(' + "'" + file["path_to_file"] + "'" + ')">Ver</button>'
        }
        if (file["ext"] == 'PDF') {
            fun_type = '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="ver_archivo(' + "'" + file["path_to_file"] + "'" + ')">Ver</button>'
        }

        var icon = (file["type"] == 'file') ?
            fun_type
            :
            '<button type="button" class="btn btn-block bg-gradient-success btn-xs">Ir</button>';

        celda5.innerHTML = (file["ext"] == -1 && file["type"] == 'file') ? '<button type="button" class="btn btn-block bg-gradient-danger btn-xs" disabled>No disponible</button>' :
            icon;
        i++;
    });
    console.log(data);

}).catch((error) => {
    console.error(error);
});

function verArchivoSKP(path) {
    $("#spinner").removeClass("hidden");

    getFileDataSKP(path).then((data) => {
        init3DModelViewer(data)
        console.log(data);

    }).catch((error) => {
        console.error(error);
        $("#spinner").addClass("hidden");

        // Handle error, show an error message, etc.
    });
}

function verArchivo(path) {
    getFileData(path).then((data) => {
        // Handle success, open modal, render PDF, etc.
        // For example, verArchivo(data['data']);
        console.log(data);
    }).catch((error) => {
        console.error(error);
        // Handle error, show an error message, etc.
    });
}



// Assign functions to the window object to make them accessible in the HTML
// window.obtenerDirectorio = obtenerDirectorio;
window.getFileDataSKP = getFileDataSKP;
window.getFileData = getFileData;
window.ver_archivo_SKP  = verArchivoSKP;
window.verArchivo = verArchivo;

console.log("LOADED")