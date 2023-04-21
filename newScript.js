import * as THREE from "three";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass";

import particlesVertexShader from "./src/shaders/particles/vertex.glsl";
import particlesFragmentShader from "./src/shaders/particles/fragment.glsl";

import diamondVertexShader from "./src/shaders/diamond/vertex.glsl";
import diamondFragmentShader from "./src/shaders/diamond/fragment.glsl";

import diamondVertexShader1 from "./src/shaders/refraction/vertex.glsl";
import diamondFragmentShader1 from "./src/shaders/refraction/fragment.glsl";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 40;
const height = 4;
const scaleArray = new Float32Array(particleCount);
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positions[i * 3 + 1] = height * 0.5 - Math.random() * height;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

// Material
const particlesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 1) },
    uSize: { value: 200 },
    uTime: { value: 0 },
  },
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Models
 */
const diamondMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: diamondVertexShader,
  fragmentShader: diamondFragmentShader,
});

const diamondMaterial1 = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: diamondVertexShader1,
  fragmentShader: diamondFragmentShader1,
});

const bgGeometry = new THREE.PlaneGeometry(20, 15);
const bgMaterial = diamondMaterial;
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, 0, -1);
scene.add(bgMesh);

const material = new THREE.MeshStandardMaterial({
  color: "#0000ff",
});

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;
gltfLoader.load("./stoneAnimation7Website.gltf", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.rotateX = Math.PI / 2;
  gltf.scene.traverse((model) => {
    if (model.isMesh) {
      model.material = diamondMaterial1;
    }
  });

  // Animation
  mixer = new THREE.AnimationMixer(gltf.scene);

  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);

    window.addEventListener("scroll", () => {
      const scrollProgress =
        window.scrollY / (document.body.clientHeight - window.innerHeight);
      const duration = action.getClip().duration;
      const time = scrollProgress * duration;
      action.time = time;
      action.play();

      mixer.update(0);
    });
  });

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let previousTime = 0;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    gltf.scene.position.y = 0.1 * Math.sin(elapsedTime);

    // Update particles material
    particlesMaterial.uniforms.uTime.value = elapsedTime;

    diamondMaterial.uniforms.uTime.value = elapsedTime;
    diamondMaterial1.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };
  tick();
  scene.add(gltf.scene);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Create a red spotlight
const spotlight = new THREE.SpotLight(0xff0000, 2);
spotlight.position.set(2, 2, 0);
spotlight.lookAt(0, 0, 0);
spotlight.angle = Math.PI / 6;
spotlight.penumbra = 0.05;
spotlight.decay = 2;
spotlight.distance = 200;
// scene.add(spotlight);

const spotLightHelper = new THREE.SpotLightHelper(spotlight);
// scene.add(spotLightHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update particles
  particlesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 2);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x18181a, 1);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*
  Post Processing
*/
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(sizes.width, sizes.height),
  0.7,
  0.3,
  0
);
composer.addPass(bloomPass);

const tick = () => {
  // noisePass.uniforms.uTime.value += 0.01;
  composer.render();
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
