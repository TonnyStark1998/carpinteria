// ENTRY
obtener_directorio();
var rutaViewDataInput = document.getElementById("ruta");

// DECLARACIONES
function loadSKP(data) {
  var initialModelData = data['model_data'];
  //  var additionalFiles = data['additional_files'];

  // Cargar el modelo principal y los archivos binarios adicionales
  //  loadModel(initialModelData);l y los archivos binarios adicionales
  //  loadModel(data);
}

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
        if (file["ext"] == 'SKP') {
          
          // fun_type = '<button type="button" class="btn btn-block bg-gradient-success btn-xs" onclick="init3DModelViewer(' + "'" + file["path_to_file"] + "'" + ')">Ver</button>'

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
  $('#modal-xl').modal('show');


  // GLTFLoader instance
  var loader = new THREE.GLTFLoader();

  // Create a new XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'arraybuffer';

  xhr.onload = function () {
    if (xhr.status === 200) {
      checkLoadComplete(xhr.response);
    } else {
      console.log('Error loading GLTF data. Status:', xhr.status);
    }
  };

  xhr.onerror = function (error) {
    console.log('Error loading GLTF data:', error);
  };

  // Open and send the request
  xhr.open('GET', '/get_file_data_skp?path=' + encodeURIComponent(_path));
  xhr.send();

  // Function to check if both GLTF and binary data are loaded
  function checkLoadComplete(gltfData) {
    if (gltfData) {
      loader.parse(gltfData, '', function (gltf) {
        var scene = new THREE.Scene();
        scene.add(gltf.scene);
        scene.scale.set(4, 4, 4); // Scale by a factor of 2 along all axes

        // Add ambient light to the scene
        const ambientLight = new THREE.AmbientLight(0x1E1E1E); // Use a light gray color
        scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize(); // Set the direction of the light
        scene.add(directionalLight);

        // Get the dimenssions
        var container = document.getElementById('scene-container');
        var containerWidth = container.clientWidth;
        var containerHeight = container.offsetHeight;

        // Initialize camera
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        // Initialize renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(containerWidth, containerHeight);
        document.getElementById('scene-container').appendChild(renderer.domElement);

        // const controls = new FlyControls(camera, renderer.domElement);
        // controls.movementSpeed = 15;
        // controls.rollSpeed = 0.2;
        // controls.dragToLook = true;

        const controls = new MapControls( camera, renderer.domElement );
        controls.enableDamping = true;

        var clock = new THREE.Clock();

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);

          // Update orbit controls
          var delta = clock.getDelta();
          controls.update(delta);

          renderer.render(scene, camera);
        };

        // Handle window resize
        window.addEventListener('resize', () => {
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;

          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();

          renderer.setSize(newWidth, newHeight);
        });

        // Start animation loop
        animate();

        console.log('Model loaded successfully.');
      });
    }
  }
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
// // IMPORTANTE HACER VISIBLE LAS FUNCIONES EN LA VENTANA!
// window.loadSKP = loadSKP
// window.obtener_directorio = obtener_directorio
// window.ver_archivo = ver_archivo
// window.convertPdfInBase64ToUrl = convertPdfInBase64ToUrl