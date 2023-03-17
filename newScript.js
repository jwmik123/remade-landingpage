import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

import particlesVertexShader from "./src/shaders/particles/vertex.glsl";
import particlesFragmentShader from "./src/shaders/particles/fragment.glsl";

import diamondVertexShader from "./src/shaders/diamond/vertex.glsl";
import diamondFragmentShader from "./src/shaders/diamond/fragment.glsl";

import noiseVertexShader from "./src/shaders/noise/vertex.glsl";
import noiseFragmentShader from "./src/shaders/noise/fragment.glsl";
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
const texture = new THREE.TextureLoader().load("./textures/5.jpg");
texture.needsUpdate = true;
const diamondMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: diamondVertexShader,
  fragmentShader: diamondFragmentShader,
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
      console.log("model is mesh");
      model.material = diamondMaterial;
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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 0);
scene.add(directionalLight);

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
const noisePass = new ShaderPass({
  uniforms: {
    uTime: { value: 0 },
    uAmount: { value: 0.1 },
  },
  vertexShader: noiseVertexShader,
  fragmentShader: noiseFragmentShader,
});

composer.addPass(renderPass);
composer.addPass(noisePass);

const tick = () => {
  noisePass.uniforms.uTime.value += 0.01;

  composer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
