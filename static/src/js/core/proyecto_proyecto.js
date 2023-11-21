obtener_directorio();
var rutaViewDataInput = document.getElementById("ruta");

function obtener_directorio(){

    $.ajax({
        url: '/get_files',
        dataType:'json',
        success:function(data){
            console.log(data);
            rutaViewDataInput.value = data['ruta'];
            var tabla = document.getElementById('file_table_id');
            var tbody = document.getElementById('table_body');
            tbody.innerHTML = '';

            var i = 0;
            data["file_list"].forEach(function (file) {
                console.log(file);
                var fila = tbody.insertRow(i);
                var celda1 = fila.insertCell(0);
                celda1.innerHTML = i;
//                celda1.innerHTML = file["file"];

                var celda2 = fila.insertCell(1);
                var icon = (file["type"] != 'file') ? '<i class="fas fa-folder icono-carpeta"></i>': '<i class="fa fa-file icono-archivo" aria-hidden="true"></i>';
                celda2.innerHTML = icon;


                var celda3 = fila.insertCell(2);
//                var icon = (file["type"] != 'file') ? '<i class="fas fa-folder icono-carpeta"></i>': '<i class="fa fa-file icono-archivo" aria-hidden="true"></i>';
                celda3.innerHTML = file["file"];
//                celda2.innerHTML = file["type"];

                var celda4 = fila.insertCell(3);
//                celda3.innerHTML = file["type"];
//                celda4.innerHTML = (file["type"] == 'file') ? '<span title="No disponible" class="badge bg-danger">No disponible</span>':
//                '<span title="Disponible" class="badge bg-success">Disponible</span>';
                celda4.innerHTML = (file["ext"] == -1 && file["type"] == 'file') ? '<span title="No disponible" class="badge bg-danger">No disponible</span>':
                '<span title="Disponible" class="badge bg-success">Disponible</span>';

                var celda5 = fila.insertCell(4);
                var icon = (file["type"] == 'file') ?
//                '<button type="button" class="btn btn-block bg-gradient-success btn-xs">Ver</button>'
                '<button type="button" class="btn btn-block bg-gradient-success btn-xs" data-toggle="modal" data-target="#modal-xl" onclick="ver_archivo('+"'"+file["path_to_file"]+"'"+')">Ver</button>'
                :
                '<button type="button" class="btn btn-block bg-gradient-success btn-xs">Ir</button>';

//                '<button type="button" class="btn btn-default" data-toggle="modal" data-target="#modal-xl">Launch Extra Large Modal</button>'
                celda5.innerHTML = (file["ext"] == -1 && file["type"] == 'file') ? '<button type="button" class="btn btn-block bg-gradient-danger btn-xs" disabled>No disponible</button>':
                icon;
                i++;
            });
        },
        error: function(data){
            console.log(data);
//            modal_error_msg.innerHTML = 'Fallo de comunicación: Los datos no fueron enviados correctamente.';
        },
    });
}
function ver_archivo(_path){
    console.log(_path);

    $.ajax({
        url: '/get_file_data',
        dataType:'json',
        data: {
            'path': _path,
        },
        success:function(data){

        var iframe = document.getElementById('pdf-iframe');

        // Base64 del contenido del PDF (reemplaza esto con tu base64 real)
        var base64PDF = data['data']; // Tu cadena base64 aquí

        // Construir la URL de datos para el iframe
        var dataURL = 'data:application/pdf;base64,' + base64PDF;

        // Establecer la URL en el iframe
        iframe.src = dataURL;
        var pdfViewer = new PDFViewer({ viewer: iframe });



//            attachmentUrl = convertPdfInBase64ToUrl(data['data']);
//            console.log(attachmentUrl);
//            $('#pdf-embed').attr('src', attachmentUrl);
        },
        error: function(data){
            console.log(data);
        },
    });
}

function convertPdfInBase64ToUrl (pdfInBase64) {
    // decode base64 string, remove space for IE compatibility
    let pdfInBinary = atob(pdfInBase64.replace(/\s/g, ''));

    // convert the PDF in binary to a BLOB object.
    let buffer = new ArrayBuffer(pdfInBinary.length);
    let view = new Uint8Array(buffer);
    for (let i = 0; i < pdfInBinary.length; i++) {
        view[i] = pdfInBinary.charCodeAt(i);
    }
    let pdfAsBlobObject = new Blob([view], { type: "application/pdf" });

    return URL.createObjectURL(pdfAsBlobObject);
}