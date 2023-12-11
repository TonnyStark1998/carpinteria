obtener_directorio();

var rutaViewDataInput = document.getElementById("ruta");
function loadSKP(data) {
  var initialModelData = data['model_data'];
  //  var additionalFiles = data['additional_files'];

  // Cargar el modelo principal y los archivos binarios adicionales
  //  loadModel(initialModelData);l y los archivos binarios adicionales
  //  loadModel(data);
}

//    console.log(base64Data)
//        app._component.methods.changeModel(base64Data)

//['model_data']
//    // Cargar y visualizar el archivo SKP al abrir el modal
//    $('#skpModal').on('shown.bs.modal', function () {
//        loadSKP(base64SKP);
//    });
//
//    // Limpiar el canvas al cerrar el modal para liberar recursos
//    $('#skpModal').on('hidden.bs.modal', function () {
//        document.getElementById('skpModalBody').innerHTML = '';
//    });


function obtener_directorio() {

  $.ajax({
    url: '/get_files',
    dataType: 'json',
    success: function (data) {
      //            console.log(data);
      rutaViewDataInput.value = data['ruta'];
      var tabla = document.getElementById('file_table_id');
      var tbody = document.getElementById('table_body');
      tbody.innerHTML = '';

      var i = 0;
      data["file_list"].forEach(function (file) {
        //                console.log(file);
        var fila = tbody.insertRow(i);
        var celda1 = fila.insertCell(0);
        celda1.innerHTML = i;
        //                celda1.innerHTML = file["file"];

        var celda2 = fila.insertCell(1);
        var icon = (file["type"] != 'file') ? '<i class="fas fa-folder icono-carpeta"></i>' : '<i class="fa fa-file icono-archivo" aria-hidden="true"></i>';
        celda2.innerHTML = icon;


        var celda3 = fila.insertCell(2);
        //                var icon = (file["type"] != 'file') ? '<i class="fas fa-folder icono-carpeta"></i>': '<i class="fa fa-file icono-archivo" aria-hidden="true"></i>';
        celda3.innerHTML = file["file"];
        //                celda2.innerHTML = file["type"];

        var celda4 = fila.insertCell(3);
        //                celda3.innerHTML = file["type"];
        //                celda4.innerHTML = (file["type"] == 'file') ? '<span title="No disponible" class="badge bg-danger">No disponible</span>':
        //                '<span title="Disponible" class="badge bg-success">Disponible</span>';
        celda4.innerHTML = (file["ext"] == -1 && file["type"] == 'file') ? '<span title="No disponible" class="badge bg-danger">No disponible</span>' :
          '<span title="Disponible" class="badge bg-success">Disponible</span>';

        var celda5 = fila.insertCell(4);
        var fun_type = '<button type="button" class="btn btn-block bg-gradient-danger btn-xs" disabled>No disponible</button>';
        if (file["ext"] == 'SKP' || true ) {
          fun_type = '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="ver_archivo_SKP(' + "'" + file["path_to_file"] + "'" + ')">Ver</button>'
        }
        if (file["ext"] == 'PDF') {
          fun_type = '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="ver_archivo(' + "'" + file["path_to_file"] + "'" + ')">Ver</button>'
        }

        var icon = (file["type"] == 'file') ?
          //                '<button type="button" class="btn btn-block bg-gradient-success btn-xs">Ver</button>'
          //                '<button type="button" class="btn btn-block bg-gradient-success btn-xs" data-toggle="modal" data-target="#modal-xl" onclick="ver_archivo('+"'"+file["path_to_file"]+"'"+')">Ver</button>'
          fun_type
          :
          '<button type="button" class="btn btn-block bg-gradient-success btn-xs">Ir</button>';

        //                '<button type="button" class="btn btn-default" data-toggle="modal" data-target="#modal-xl">Launch Extra Large Modal</button>'
        celda5.innerHTML = (file["ext"] == -1 && file["type"] == 'file') ? '<button type="button" class="btn btn-block bg-gradient-danger btn-xs" disabled>No disponible</button>' :
          icon;
        i++;
      });
    },
    error: function (data) {
      console.log(data);
      //            modal_error_msg.innerHTML = 'Fallo de comunicación: Los datos no fueron enviados correctamente.';
    },
  });
}
function ver_archivo_SKP(_path) {
  //    console.log(_path);
  //    console.log("ver_archivo_SKP(_path)");
  //


  $('#modal-xl').modal('show');

  $.ajax({
    url: '/get_file_data_skp',
    data: {
      'path': _path,
    },
    method: 'GET',
    responseType: 'text',
    success: function (data) {

      var [dataGltf, path_bin] = data.split('---MARCA---');

      $.ajax({
        url: '/get_file_data_skp_bin',
        data: {
          'path_bin': path_bin,
        },
        method: 'GET',
        responseType: 'text',
        success: function (data_bin) {

          // Separar los datos usando el marcador
          var [dataBin] = data_bin;

          // Crear Blobs a partir de los datos binarios
          var blobBin = new Blob([dataBin], { type: 'application/octet-stream' });
          var blobGltf = new Blob([dataGltf], { type: 'application/json' });

          // Crear un WebGLRenderer
          var renderer = new THREE.WebGLRenderer();
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.body.appendChild(renderer.domElement);

          // Convertir los Blobs comprimidos a ArrayBuffer
          var readerBin = new FileReader();
          var readerGltf = new FileReader();

          readerBin.on// Separar los datos usando el marcador
          // Separar los datos usando el marcador
          var [dataBin] = data_bin;

          // Crear Blobs a partir de los datos binarios y GLTF
          var blobBin = new Blob([dataBin], { type: 'application/octet-stream' });
          var blobGltf = new Blob([dataGltf], { type: 'application/json' });

          // Convertir los Blobs comprimidos a ArrayBuffer
          var readerBin = new FileReader();
          var readerGltf = new FileReader();

          readerBin.onload = function () {
            console.log('Binario cargado correctamente');
            var arrayBufferBin = readerBin.result;

            // Truncar la longitud para que sea divisible por 4
            var float32ArrayLength = Math.floor(arrayBufferBin.byteLength / 4) * 4;

            // Crear un BufferGeometry directamente y asignarle los datos binarios
            var geometry = new THREE.BufferGeometry();
            var float32Array = new Float32Array(arrayBufferBin, 0, float32ArrayLength / 4);
            geometry.setAttribute('position', new THREE.BufferAttribute(float32Array, 3));

            console.log(float32Array);  // Imprimir el array directamente

            // Escalar la geometría para hacerla más visible
            geometry.scale(0.1, 0.1, 0.1);

            // Crear una escena
            var scene = new THREE.Scene();

            // Create a cube
            // var geometry = new THREE.BoxGeometry();
            // var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
            // var cube = new THREE.Mesh(geometry, material);

            // Add the cube to the scene
            // scene.add(cube);
            
            // Agregar luces a la escena
            var ambientLight = new THREE.AmbientLight(0xffffff);
            scene.add(ambientLight);

            var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            // Crear un WebGLRenderer y montarlo en el elemento con ID "app"
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x1E1E1E);
            document.getElementById('scene-container').appendChild(renderer.domElement);

            // Crear una cámara
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // const controls = new OrbitControls(camera, renderer.domElement);
            // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            // controls.dampingFactor = 0.25;
            // controls.screenSpacePanning = false;
            // controls.maxPolarAngle = Math.PI / 2;
        

            // Renderizar la escena
            var animate = function () {
              requestAnimationFrame(animate);
              
              // Update orbit controls
              // controls.update();

              renderer.render(scene, camera);
            };

            // Iniciar la animación
            animate();
            console.log('La figura se renderizó correctamente.');
          };

          // Configurar el evento onload para manejar la lectura completa del bin
          readerGltf.onload = function () {
            console.log('GLTF cargado correctamente');
            // Convertir el Blob comprimido a ArrayBuffer
            
            readerBin.readAsArrayBuffer(blobBin);
          };

          // Convertir el Blob comprimido a ArrayBuffer
          readerGltf.readAsArrayBuffer(blobGltf);



          // //            console.log('JSON recibido desde el servidor:', dataGltf);

          // // Crear un FileReader para leer los datos binarios
          // var reader = new FileReader();

          // // Convertir el Blob comprimido a ArrayBuffer
          // reader.readAsArrayBuffer(blobBin);
          // // Configurar el evento onload para manejar la lectura completa
          // //            reader.onload = function () {
          // // Los datos descomprimidos estarán en reader.result
          // //              var descomprimidoBin = reader.result;

          // //              console.log('Datos binarios descomprimidos:', descomprimidoBin);

          // // Continuar con el procesamiento, por ejemplo, cargar el modelo GLTF
          // var urlGltf = window.URL.createObjectURL(blobGltf);
          // var loader = new THREE.GLTFLoader();
          // loader.load(
          //   urlGltf,
          //   function (gltf) {
          //     console.log("llego aqui");
          //     // Agregar el modelo GLTF a la escena
          //     scene.add(gltf.scene);

          //     // Configurar la cámara
          //     // camera.position.z = 5;

          //     // Renderizar la escena
          //     var animate = function () {
          //       requestAnimationFrame(animate);
          //       renderer.render(scene, camera);
          //     };

          //     animate();
          //   },
          //   undefined,
          //   function (error) {
          //     console.log('Error al cargar el modelo GLTF:', error);
          //   }
          // );
          // //            };

        },
        error: function (error) {
          console.log('Error al obtener archivos:', error);
        }
      });

    },
    error: function (error) {
      console.log('Error al obtener archivos:', error);
    }
  });






  //---------------------------
  //    $.ajax({
  //  url: '/get_file_data_skp',
  //  method: 'GET',
  //  data: {
  //    'path': _path,
  //  },
  //  responseType: 'arraybuffer',
  //  success: function(data) {
  //    var encoder = new TextEncoder();
  //    var truncatedData = data;
  ////    var truncatedData = data.slice(0, -1);
  //    var arrayBuffer = encoder.encode(data).buffer;
  //  console.log('Tipo de datos recibidos:', typeof arrayBuffer);
  //console.log('Longitud de datos recibidos:', arrayBuffer ? arrayBuffer.byteLength : 'undefined');
  //
  //    var adjustedData = new Uint8Array(arrayBuffer.byteLength + 1);
  ////    adjustedData.set(new Uint8Array(arrayBuffer));
  ////    adjustedData.set(new Uint8Array(data));
  //    // Crear un Blob para el archivo ZIP
  //    var blob = new Blob([arrayBuffer, new Uint8Array([0])], { type: 'application/zip' });
  //
  //    // Utilizar JSZip para descomprimir el archivo ZIP
  //    JSZip.loadAsync(blob).then(function (zip) {
  //      // Supongamos que el modelo GLTF está en un archivo llamado 'modelo.gltf' en el ZIP
  //      zip.file('modelo.gltf').async('arraybuffer').then(function (gltfData) {
  //        // Configurar Three.js
  //        var scene = new THREE.Scene();
  //        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //        var renderer = new THREE.WebGLRenderer();
  //        renderer.setSize(window.innerWidth, window.innerHeight);
  //        document.getElementById('app').appendChild(renderer.domElement);
  //
  //        // Cargar el modelo GLTF con Three.js
  //        var loader = new THREE.GLTFLoader();
  //        loader.parse(gltfData, '', function (gltf) {
  //          // Agregar el modelo GLTF a la escena
  //          scene.add(gltf.scene);
  //
  //          // Configurar la cámara
  //          camera.position.z = 5;
  //
  //          // Renderizar la escena
  //          var animate = function () {
  //            requestAnimationFrame(animate);
  //            renderer.render(scene, camera);
  //          };
  //
  //          animate();
  //        });
  //
  //      }).catch(function (error) {
  //        console.error('Error al cargar el archivo GLTF desde el ZIP:', error);
  //      });
  //    }).catch(function (error) {
  //      console.error('Error al cargar el ZIP:', error);
  //    });
  //  },
  //  error: function(error) {
  //    console.error('Error al obtener archivos ZIP:', error);
  //  }
  //});
  //-----------------------------


  //    fetch('/get_file_data_skp')
  //      .then(response => response.blob())
  //      .then(blob => {
  //          // Descomprimir el archivo zip
  //          console.log('.then(blob => {');
  //          return JSZip.loadAsync(blob);
  //      })
  //        .then(zip => {
  //        console.log('.then(zip => {');
  //        // Obtener las rutas de los archivos descomprimidos
  //        const gltfPath = Object.keys(zip.files).find(key => key.endsWith('.gltf'));
  //        const binPath = Object.keys(zip.files).find(key => key.endsWith('.bin'));
  //
  //        // Leer el contenido de los archivos
  //        const gltfContent = zip.files[gltfPath].async('string');
  //        const binContent = zip.files[binPath].async('uint8array');
  //
  //        // Crear el modelo GLTF
  //        const loader = new THREE.GLTFLoader();
  //        loader.parse({
  //          gltf: gltfContent,
  //          bin: binContent
  //        }, '', (gltf) => {
  //          // Ahora, 'gltf.scene' contiene tu modelo 3D cargado
  //          const scene = new THREE.Scene();
  //          scene.add(gltf.scene);
  //
  //          // Configurar la cámara y el renderer según sea necesario
  //          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //          const renderer = new THREE.WebGLRenderer();
  //          renderer.setSize(window.innerWidth, window.innerHeight);
  //
  //          // Añadir el renderer al contenedor con ID "app"
  //          document.getElementById('app').appendChild(renderer.domElement);
  //
  //          // Renderizar la escena
  //          const animate = () => {
  //            requestAnimationFrame(animate);
  //            renderer.render(scene, camera);
  //          };
  //
  //          animate();
  //        });
  //      })
  //  .catch(error => console.log('Error al descargar archivos:', error));




  //    $('#skpModal').modal('show');
  //    $.ajax({
  //        url: '/get_file_data_skp',
  //        dataType:'json',
  //        data: {
  //            'path': _path,
  //        },
  //        success:function(data){
  //
  //           console.log(data);
  ////        var iframe = document.getElementById('pdf-iframe');
  ////
  ////        // Base64 del contenido del PDF (reemplaza esto con tu base64 real)
  ////        var base64PDF = data['data']; // Tu cadena base64 aquí
  //        loadSKP(data);
  ////        loadSKP(base64PDF);
  //
  ////        // Construir la URL de datos para el iframe
  ////        var dataURL = 'data:application/pdf;base64,' + base64PDF;
  ////
  ////        // Establecer la URL en el iframe
  ////        iframe.src = dataURL;
  ////        var pdfViewer = new PDFViewer({ viewer: iframe });
  //
  //
  //
  ////            attachmentUrl = convertPdfInBase64ToUrl(data['data']);
  ////            console.log(attachmentUrl);
  ////            $('#pdf-embed').attr('src', attachmentUrl);
  //        },
  //        error: function(data){
  //            console.log(data);
  //        },
  //    });
}
function ver_archivo(_path) {
  //    console.log(_path);

  $('#modal-xl').modal('show');
  $.ajax({
    url: '/get_file_data',
    dataType: 'json',
    data: {
      'path': _path,
    },
    success: function (data) {

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
    error: function (data) {
      console.log(data);
    },
  });
}

function convertPdfInBase64ToUrl(pdfInBase64) {
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