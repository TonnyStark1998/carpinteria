// File: 3DModelViewer.js
import { MapControls } from 'three/addons/controls/MapControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

var scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
var rgbeLoader = new RGBELoader();

// Function to remove all objects from the scene
function removeAllObjects() {
  while (scene.children.length > 0) {
    const obj = scene.children[0];

    // Dispose of resources if necessary
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      obj.material.dispose();
    }

    // Remove the object from the scene
    scene.remove(obj);
  }
}

function init3DModelViewer(glbData) {
  // GLTFLoader instance
  var loader = new THREE.GLTFLoader();
  // Function to check if both GLTF and binary data are loaded
  if (glbData) {
    loader.parse(glbData, '', function (gltf) {
      // renderer.clear();
      removeAllObjects()

      scene.add(gltf.scene);
      scene.scale.set(4, 4, 4); // Scale by a factor of 2 along all axes

      // Load the HDRI environment map
      rgbeLoader.setDataType(THREE.FloatType);
      rgbeLoader.load('static/equirectangular/small_empty_room_3_4k.hdr', function (texture) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        var envMap = pmremGenerator.fromEquirectangular(texture).texture;

        // Update scene background and ambient light with the HDRI map
        scene.background = envMap;
        scene.environment = envMap;
        // Dispose of the HDR loader to free up memory
        texture.dispose();
        pmremGenerator.dispose();
      })

      // Add ambient light to the scene
      // const ambientLight = new THREE.AmbientLight(0x1E1E1E); // Use a light gray color
      // scene.add(ambientLight);

      // // Create a directional light
      // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      // directionalLight.position.set(1, 1, 1).normalize(); // Set the direction of the light
      // scene.add(directionalLight);

      // Get the dimensions
      $("#spinner").addClass("hidden");

      var container = document.getElementById('scene-container');
      var containerWidth = container.clientWidth;
      var containerHeight = container.offsetHeight;

      // Initialize camera
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 10;

      // Initialize renderer
      renderer.setSize(containerWidth, containerHeight);
      document.getElementById('scene-container').appendChild(renderer.domElement);

      const controls = new MapControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Update orbit controls
        // var delta = clock.getDelta();
        controls.update();

        renderer.render(scene, camera);
      };

      // Handle window resize
      window.addEventListener('resize', () => {

        var container = document.getElementById('scene-container');
        var containerWidth = container.clientWidth;
        var containerHeight = container.offsetHeight;

        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(containerWidth, containerHeight);
      });

      // Start animation loop
      animate();

      console.log('Model loaded successfully.');
    });
  }
}

export default init3DModelViewer;

console.log("LOADED")