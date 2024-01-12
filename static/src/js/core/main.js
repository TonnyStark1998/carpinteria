import { obtenerDirectorio, getFileDataSKP, getFileData } from './ajaxModule.js';
import  init3DModelViewer  from './3DModelViewer.js';
call_obtenerDirectorio('');
var rutaViewDataInput = document.getElementById("ruta");
function returnFolder(){
    var route = rutaViewDataInput.value.split('/');
    route.pop();
    call_obtenerDirectorio(route.join('/'));
//    rutaViewDataInput.value = route.join('/');
}

function call_obtenerDirectorio(_path){
// var rutaViewDataInput;
    obtenerDirectorio(_path).then((data) => {
        rutaViewDataInput.value = data['ruta'];
        console.log("data['ruta']");
        console.log(data['ruta'])
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

            var celda5 = fila.insertCell(3);
            var fun_type = '<button type="button" class="btn btn-block bg-gradient-danger btn-xs" disabled>No disponible</button>';

            var rutaCompleta = document.getElementById("ruta").value;
            var existeTexto = rutaCompleta.includes("17");
            var existeTextoProyecto = rutaCompleta.includes("14");
            if (rutaCompleta.includes("OBSOLETOS")){
                existeTexto = false;
                existeTextoProyecto = false;
            }
            var urlCompleta = window.location.href;

            var urlObjeto = new URL(urlCompleta);
            var segmentos = urlObjeto.pathname.split('/');
            var ultimoSegmento = segmentos.pop();
            if (file["ext"] == 'SKP' && existeTextoProyecto == true && ultimoSegmento == 0) {
                fun_type = '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="ver_archivo_SKP(' + "'" + file["path_to_file"] + "'" + ')">Ver</button>'
            }
            if (file["ext"] == 'PDF' && existeTexto == true) {
                fun_type = '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="verArchivo(' + "'" + file["path_to_file"] + "'" + ')">Ver</button>'
            }

            var icon = (file["type"] == 'file') ?
                fun_type
                :
                '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="obtener_directorio(' + "'" +data["ruta"] + '/' + file["file"] + "'" + ')">Ir</button>';

            celda5.innerHTML = (file["ext"] == -1 && file["type"] == 'file') ? '<button type="button" class="btn btn-block bg-gradient-danger btn-xs" disabled>No disponible</button>' :
                icon;
            i++;
        });
        console.log(data);

    }).catch((error) => {
        console.error(error);
    });


}

function obtener_directorio(_path){
    console.log("obtener_directorio")
    console.log(_path)
    call_obtenerDirectorio(_path);
}

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
  $('#skpModal').modal('show');
    getFileData(path).then((data) => {
        // Handle success, open modal, render PDF, etc.
        // For example, verArchivo(data['data']);
        console.log(data);

          var iframe = document.getElementById('pdf-iframe');

          // Base64 del contenido del PDF (reemplaza esto con tu base64 real)
          var base64PDF = data['data']; // Tu cadena base64 aquí

          // Construir la URL de datos para el iframe
          var dataURL = 'data:application/pdf;base64,' + base64PDF;

          // Establecer la URL en el iframe
          iframe.src = dataURL;
          var pdfViewer = new PDFViewer({ viewer: iframe });
    }).catch((error) => {
        console.error(error);
        // Handle error, show an error message, etc.
    });
}



// Assign functions to the window object to make them accessible in the HTML
window.obtenerDirectorio = obtenerDirectorio;
window.getFileDataSKP = getFileDataSKP;
window.getFileData = getFileData;
window.ver_archivo_SKP  = verArchivoSKP;
window.verArchivo = verArchivo;
//------------------
window.obtener_directorio = obtener_directorio;
window.returnFolder = returnFolder;
console.log("LOADED")