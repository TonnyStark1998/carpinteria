//
//    Vue.createApp({
//      methods: {
//        initThree() {
//          const scene = new THREE.Scene();
//          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//          const renderer = new THREE.WebGLRenderer();
//          renderer.setSize(window.innerWidth, window.innerHeight);
//          document.getElementById('app').appendChild(renderer.domElement);
//
//          const geometry = new THREE.BoxGeometry();
//          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//          const cube = new THREE.Mesh(geometry, material);
//          scene.add(cube);
//
//          camera.position.z = 5;
//
//          const animate = () => {
//            requestAnimationFrame(animate);
//            cube.rotation.x += 0.01;
//            cube.rotation.y += 0.01;
//            renderer.render(scene, camera);
//          };
//
//          animate();
//        },
//      },
//      mounted() {
//        this.initThree();
//      },
//    }).mount('#app');


//var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//var renderer = new THREE.WebGLRenderer();
//var appContainer = document.getElementById('app');
//
//renderer.setSize(appContainer.clientWidth, appContainer.clientHeight);
//
//// Crear el renderizador y establecer su tamaño
////var renderer = new THREE.WebGLRenderer();
//var canvas = renderer.domElement;
//appContainer.appendChild(canvas);
//
//// Establecer el tamaño del renderizador para que llene el contenedor
//
//function loadModel(modelData) {
//  var loader = new THREE.GLTFLoader();
//
//  // Parse the GLTF data (assuming it's a string containing the GLTF content)
////  var gltfData = JSON.stringify(modelData['model_data']);
//
//  var gltfData = JSON.stringify(modelData['model_data']);
//  // Decodificar la cadena Base64 a un ArrayBuffer
//  console.log("modelData['model_data']");
//  console.log(modelData);
//  var arrayBuffer = base64ToArrayBuffer(modelData);
//
//  // Crear un Blob a partir del ArrayBuffer
//  var blob = new Blob([arrayBuffer], { type: 'data:model/gltf-binary;base64,' });
//  var blobUrl = URL.createObjectURL(blob);
//  // Load the GLTF with the embedded binary data
//  console.log('blobUrl');
//  console.log(blobUrl);
//  loader.parse(arrayBuffer).then((gltf) => {
//    scene.add(gltf.scene);
//  });
//  camera.position.z = 5;


//  loader.load(
//    blobUrl,
//    (gltf) => {
//        console.log('(gltf) => {');
//      // The GLTF model is loaded successfully
////      var model = gltf.scene;
////
////      // Add the model to the scene
////      scene.add(model);
////
////      // Render the scene
////      function render() {
////        renderer.render(scene, camera);
////        requestAnimationFrame(render);
////      }
////
////      // Call the render function
////      render();
//    },
//  (progress) => {
//    // Esta parte del código se ejecuta durante la carga del modelo
//    console.log('Cargando modelo:', progress.loaded / progress.total * 100 + '% completado');
//  },
////    undefined,
//    (error) => {
//      console.error('Error loading GLTF model', error);
//    if (error.message) {
//      console.error('Mensaje de error:', error.message);
//    }
//
//    console.error('Estado del error:', error);
//    }
//  );
//}

//// Función para convertir una cadena Base64 a un ArrayBuffer
//function base64ToArrayBuffer(base64) {
//    console.log("base64");
//    console.log(base64);
//  var binaryString = atob(base64);
//  var length = binaryString.length;
//  var arrayBuffer = new ArrayBuffer(length);
//  var uint8Array = new Uint8Array(arrayBuffer);
//
//  for (let i = 0; i < length; i++) {
//    uint8Array[i] = binaryString.charCodeAt(i);
//  }
//
//  return arrayBuffer;
//}
//**********************************************
// Uso de la función
// Supongamos que modelData es la respuesta JSON del servidor con el modelo GLTF modificado
//loadModel(modelData);





//// Función para convertir una cadena Base64 a un ArrayBuffer
//function base64ToArrayBuffer(base64) {
//  const binaryString = window.atob(base64);
//  const binaryLen = binaryString.length;
//  const bytes = new Uint8Array(binaryLen);
//
//  for (let i = 0; i < binaryLen; i++) {
//    bytes[i] = binaryString.charCodeAt(i);
//  }
//
//  return bytes.buffer;
//}


//const ThreeViewer = {
//  props: ['initialModelData', 'additionalFiles'],
//  data() {
//    return {
//      modelData: this.initialModelData,
//      scene: null,
//      camera: null,
//      renderer: null,
//    };
//  },
//  mounted() {
//    this.initScene();
//    this.loadModel();
//    this.animate();
//  },
//  methods: {
//    initScene() {
//      this.scene = new THREE.Scene();
//      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//      this.renderer = new THREE.WebGLRenderer();
//      this.renderer.setSize(window.innerWidth, window.innerHeight);
//      document.getElementById('app').appendChild(this.renderer.domElement);
//      this.camera.position.z = 5;
//    },
//    loadModel() {
//      const loader = new THREE.GLTFLoader();
//      console.log("MODEL DADA");
//      console.log(this.modelData);
//      loader.load(
//        `data:application/octet-stream;base64,${this.modelData}`,
//        (gltf) => {
//          this.scene.add(gltf.scene);
//        },
//        (progress) => {
//          console.log('Cargando modelo:', progress.loaded / progress.total * 100 + '% completado');
//        },
//        (error) => {
//          console.error('Error cargando el modelo GLTF:', error);
//
//          // Tratar el response como ArrayBuffer y convertirlo a texto
//          const arrayBuffer = error.target.response;
//          console.log('Texto recibido:', arrayBuffer);
//          const texto = new TextDecoder().decode(arrayBuffer);
//          console.log('Texto recibido:', texto);
//        }
//      );
//
//
//    },
//    animate() {
//      requestAnimationFrame(this.animate.bind(this));
//      this.renderer.render(this.scene, this.camera);
//    },
//  },
//  watch: {
//    initialModelData: function (newModelData, oldModelData) {
//      this.modelData = newModelData;
//      this.scene.children = [];
//      this.loadModel();
//    },
//    additionalFiles: function (newAdditionalFiles, oldAdditionalFiles) {
//      console.log('Additional files changed:', newAdditionalFiles);
//    },
//  },
//};
//
//// Crear la aplicación Vue
//const app = Vue.createApp({
//  setup() {
//    const threeViewerRef = Vue.ref(null);
//
//    return {
//      threeViewerRef,
//    };
//  },
//  template: '<ThreeViewer ref="threeViewerRef" :initialModelData="initialModelData" :additionalFiles="additionalFiles" />',
//  data() {
//    return {
//      initialModelData: '',
//      additionalFiles: {},
//    };
//  },
//});
//
//// Registrar el componente ThreeViewer
//app.component('ThreeViewer', ThreeViewer);
//
//// Montar la aplicación en el elemento con id="app"
//const mountedApp = app.mount('#app');


//
//const ThreeViewer = {
//  props: ['initialModelData', 'additionalFiles'],
//  data() {
//    return {
//      modelData: this.initialModelData,
//      scene: null,
//      camera: null,
//      renderer: null,
//    };
//  },
//  mounted() {
//    // Inicializar la escena, cámara y renderizador
//    this.initScene();
//
//    // Cargar el modelo 3D
//    this.loadModel();
//  },
//  methods: {
//    initScene() {
//      this.scene = new THREE.Scene();
//      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//      this.renderer = new THREE.WebGLRenderer();
//      this.renderer.setSize(window.innerWidth, window.innerHeight);
//      document.getElementById('app').appendChild(this.renderer.domElement);
//
//      this.camera.position.z = 5;
//    },
//    loadModel() {
//      // Utiliza Three.js GLTFLoader para cargar el modelo
//      const loader = new THREE.GLTFLoader();
//      loader.load(`data:application/json;base64,${this.modelData}`, (gltf) => {
//        // Añade el modelo a la escena
//        this.scene.add(gltf.scene);
//      });
//    },
//    animate() {
//      requestAnimationFrame(this.animate.bind(this));
//      this.renderer.render(this.scene, this.camera);
//    },
//  },
//  watch: {
//    // Observa cambios en el modelo y vuelve a cargarlo si es necesario
//    initialModelData: function (newModelData, oldModelData) {
//      this.modelData = newModelData;
//      this.scene.children = [];  // Limpia la escena
//      this.loadModel();
//    },
//    additionalFiles: function (newAdditionalFiles, oldAdditionalFiles) {
//      console.log('Additional files changed:', newAdditionalFiles);
//      // Aquí puedes realizar acciones adicionales si los archivos adicionales cambian
//    },
//  },
//  mounted() {
//    this.initScene();
//    this.loadModel();
//    this.animate();
//  },
//};
//
//// Crear la aplicación Vue después de cargar Vue.js
//const app = Vue.createApp({
//  template: '<ThreeViewer :initialModelData="initialModelData" :additionalFiles="additionalFiles" />',
//  data() {
//    return {
//      initialModelData: '', // Inicializa con una cadena vacía o con los datos iniciales
//      additionalFiles: {},  // Inicializa con un objeto vacío o con los datos iniciales
//    };
//  },
//});
//
//// Registrar el componente ThreeViewer
//app.component('ThreeViewer', ThreeViewer);
//
//// Montar la aplicación en el elemento con id="app"
//const mountedApp = app.mount('#app');


//
//    const ThreeViewer = {
//      template: '<div ref="viewerContainer"></div>',
//      data() {
//        return {
//          cubeRotation: { x: 0, y: 0 },
//        };
//      },
//      mounted() {
//        const scene = new THREE.Scene();
//        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//        const renderer = new THREE.WebGLRenderer();
//        renderer.setSize(window.innerWidth, window.innerHeight);
//        this.$refs.viewerContainer.appendChild(renderer.domElement);
//
//        const geometry = new THREE.BoxGeometry();
//        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//        const cube = new THREE.Mesh(geometry, material);
//        scene.add(cube);
//
//        // Posiciona la cámara para que sea visible
//        camera.position.z = 5;
//
//        // Añadir listener de evento para el movimiento del mouse
//        window.addEventListener('mousemove', this.handleMouseMove);
//
//        // Animación
//        const animate = () => {
//          requestAnimationFrame(animate);
//
//          // Rota el cubo con los valores actuales de cubeRotation
//          cube.rotation.x = this.cubeRotation.x;
//          cube.rotation.y = this.cubeRotation.y;
//
//          renderer.render(scene, camera);
//        };
//
//        window.addEventListener('resize', () => {
//          camera.aspect = window.innerWidth / window.innerHeight;
//          camera.updateProjectionMatrix();
//          renderer.setSize(window.innerWidth, window.innerHeight);
//        });
//
//        animate();
//      },
//      methods: {
//        handleMouseMove(event) {
//          // Actualiza cubeRotation con la posición del mouse
//          this.cubeRotation.x = (event.clientY / window.innerHeight) * 2 - 1;
//          this.cubeRotation.y = -(event.clientX / window.innerWidth) * 2 + 1;
//        },
//      },
//    };
//
//    const app = Vue.createApp({
//      template: '<ThreeViewer />',
//    });
//
//    app.component('ThreeViewer', ThreeViewer);
//
//    app.mount('#app');




//    // Componente de Vue para la escena 3D
//    const ThreeViewer = {
//      template: '<div ref="viewerContainer"></div>',
//      mounted() {
//        // Configurar la escena
//        const scene = new THREE.Scene();
//        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//        const renderer = new THREE.WebGLRenderer();
//        renderer.setSize(window.innerWidth, window.innerHeight);
//        this.$refs.viewerContainer.appendChild(renderer.domElement);
//
//        // Crear un cubo
//        const geometry = new THREE.BoxGeometry();
//        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//        const cube = new THREE.Mesh(geometry, material);
//        scene.add(cube);
//
//        // Posicionar la cámara
//        camera.position.z = 5;
//
//        // Animación
//        const animate = () => {
//          requestAnimationFrame(animate);
//
//          // Rotar el cubo
//          cube.rotation.x += 0.01;
//          cube.rotation.y += 0.01;
//
//          renderer.render(scene, camera);
//        };
//
//        // Renderizar la animación
//        animate();
//      },
//    };
//
//    // Crear la aplicación Vue después de cargar Vue.js
//    const app = Vue.createApp({
//      template: '<ThreeViewer />',
//    });
//
//    // Registrar el componente ThreeViewer
//    app.component('ThreeViewer', ThreeViewer);
//
//    // Montar la aplicación en el elemento con id="app"
//    app.mount('#app');
//
//
//
//const app = Vue.createApp({
//  data() {
//    return {
//      base64ModelData: 'smn'
//    };
//  },
//  delimiters: ['[[', ']]'],
//  methods: {
//    changeModel(newBase64Model) {
//        console.log('Cambiando el modelo a:');
//        this.base64ModelData = newBase64Model;
////        this.initThree();
//      // Obtén la instancia del componente ThreeViewer
//      const threeViewerComponent = app.component('ThreeViewer');
//        console.log(threeViewerComponent);
//      // Accede al método initThree del componente ThreeViewer
//      if (threeViewerComponent && threeViewerComponent.methods && threeViewerComponent.methods.initThree) {
//        threeViewerComponent.methods.initThree.call(threeViewerComponent, newBase64Model);
//      } else {
//        console.error('El método initThree no está definido en el componente ThreeViewer.');
//      }
//    },
//  },
//});
//
//app.component('ThreeViewer', {
//  props: ['modelData'],
//  template: '<div ref="viewerContainer"></div>',
//  mounted() {
//   console.log('Componente ThreeViewer montado');
//    // Emitir un evento cuando la referencia esté disponible
//    console.log(this);
////    this.$emit('viewerContainerReady', this.$refs.viewerContainer);
////    this.initThree(this.modelData);
//  },
//  methods: {
//    watch: {
//        // Observa cambios en la propiedad base64ModelData
//        base64ModelData: function (newBase64, oldBase64) {
//          console.log('Modelo base64 actualizado. Volviendo a renderizar ThreeViewer.');
//          // Vuelve a ejecutar initThree con la nueva cadena base64
//          this.$refs.threeViewer.initThree(newBase64);
//        },
//    },
//    initThree(modelData) {
////    if (this.$refs.viewerContainer) {
////      // Resto del código...
//////      this.$refs.viewerContainer.appendChild(renderer.domElement);
////    } else {
////      console.error('La referencia viewerContainer no está definida.');
////    }
////      console.log('Renderizando con la cadena base64:', modelData);
//      // Decodificar base64 a ArrayBuffer
//      const decodedData = atob(modelData);
//      const arrayBuffer = new ArrayBuffer(decodedData.length);
//      const uint8Array = new Uint8Array(arrayBuffer);
//      for (let i = 0; i < decodedData.length; ++i) {
//        uint8Array[i] = decodedData.charCodeAt(i);
//      }
//
//      // Crear una escena de Three.js
//      const scene = new THREE.Scene();
//      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//      const renderer = new THREE.WebGLRenderer();
//      renderer.setSize(window.innerWidth, window.innerHeight);
//      this.mounted();
//      console.log("this.$refs");
//      console.log(this);
////      this.template.viewerContainer.appendChild(renderer.domElement);
//
//      // Crear un cargador de glTF
//      const loader = new THREE.GLTFLoader();
//      loader.parse(arrayBuffer).then((gltf) => {
//        scene.add(gltf.scene);
//      });
//
//      // Configurar la cámara
//      camera.position.z = 5;
//
//      // Animación
//      const animate = () => {
//        requestAnimationFrame(animate);
//        renderer.render(scene, camera);
//      };
//
//      animate();
//    },
//  },
//});
////}).mount();
//
//app.mount('#app');
//app.component('ThreeViewer').mount();
//app.mount(threeViewerComponent);
//// Exponer la instancia de Vue para que sea accesible desde otros scripts
////const vueApp = app.mount('#app');

//window.vueApp = vueApp;
//const { createApp } = Vue
//
//createApp({
//    data() {
//        return {
//            message: 'Hello Vue perron!'
//        }
//    },
//    delimiters: ['[[', ']]'],
//}).mount('#app2')

