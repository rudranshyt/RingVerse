import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("three-container").appendChild(renderer.domElement);

const gradientMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color1: { value: new THREE.Color(0xffc0cb) },
    color2: { value: new THREE.Color(0xffd1dc) },
    color3: { value: new THREE.Color(0xffe4e1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    void main() {
      gl_FragColor = vec4(mix(mix(color1, color2, vUv.y), color3, vUv.y * 0.5), 1.0);
    }
  `,
  side: THREE.BackSide,
});

const gradientSky = new THREE.Mesh(
  new THREE.SphereGeometry(20, 32, 32),
  gradientMaterial
);
scene.add(gradientSky);

const textureLoader = new THREE.TextureLoader();
const velvetTexture = textureLoader.load("../images/red-velvet.jpg");

const velvetMaterial = new THREE.MeshStandardMaterial({
  map: velvetTexture,
  roughness: 0.8,
  metalness: 0.05,
  emissive: new THREE.Color(0xff4444),
  emissiveIntensity: 0.2,
  normalMap: textureLoader.load("../images/velvet-normal-map.jpg"),
});

const boxBase = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 1, 2.8),
  velvetMaterial
);
scene.add(boxBase);

const boxLid = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.8, 2.8),
  velvetMaterial
);

const lidPivot = new THREE.Object3D();

boxLid.position.set(0, 0.5, 0);
lidPivot.add(boxLid);
scene.add(lidPivot);

lidPivot.position.set(0, 1, 0);
gsap.to(lidPivot.rotation, {
  duration: 3,
  x: -Math.PI / 2,
  ease: "power1.inOut",
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.7, 100);
pointLight.position.set(5, 5, 5);
pointLight.castShadow = true;
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  if (window.innerWidth < 600) {
    camera.position.set(0, 1.5, 4);
  } else {
    camera.position.set(0, 2, 6);
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
