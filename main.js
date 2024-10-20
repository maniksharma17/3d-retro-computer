import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 20);
camera.position.z = 5;
scene.add(camera);
scene.background = new THREE.Color('#white'); 

// cube
let box = new THREE.BoxGeometry(2,2,2)
let material = new THREE.MeshStandardMaterial({
  color: 'blue'
})
let cube = new THREE.Mesh(box, material)
// scene.add(cube)


// Ambient Light (soft overall light)
const ambientLight = new THREE.AmbientLight("white", 0.3); 
scene.add(ambientLight);

// Directional Light (main light source, simulating the sun)
const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows from directional light
scene.add(directionalLight);

// Set the shadow properties for the directional light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Point Light (adds interactive lighting with falloff)
const pointLight = new THREE.PointLight("white", 1, 100);
pointLight.position.set(0, 5, 5);
pointLight.castShadow = true; // Enable shadows from point light
scene.add(pointLight);

// HDRI Lights
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./hdri_lights2.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

// 3d model
const loader = new GLTFLoader();
loader.load('./old_computer.glb', (gltf)=>{
  scene.add(gltf.scene)
})


// initialize renderer
const canvas = document.querySelector('canvas');
let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;


window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

let clock = new THREE.Clock();
function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.y += 0.01;
  controls.update();
}

animate();
