// ./js/index.js
import * as THREE from 'three';
import { OrbitControls } from '../three_class/OrbitControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function () {
  // ====== CANVAS & RENDERER (mobile-safe) ======
  const canvas = document.getElementById('conigliobcg');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,         // su mobile: off
    alpha: false,             // evita layer trasparente su GPU deboli
    powerPreference: 'high-performance'
  });

  const DPR_MAX = 1.5;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_MAX));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false; // se proprio servono: true + tipo PCFSoft
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ====== SCENA ======
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 45, 180);

  // ====== CAMERA ======
  // I modelli sono a Z negative (~ -140 / -260). Mettiamo la camera davanti e puntiamo al soggetto.
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  const player = { height: 1.8 };
  camera.position.set(0, player.height + 2, 30); // davanti alla scena
  camera.lookAt(new THREE.Vector3(0, player.height, -140));
  camera.setFocalLength(35);

  // ====== LUCI (leggere) ======
  const ambLight = new THREE.AmbientLight(0xffffff, 1.25);
  scene.add(ambLight);

  // ====== CONTROLS ======
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  // Distanze sensate per evitare “singolarità” camera=target
  controls.minDistance = 10;
  controls.maxDistance = 120;
  // Target sul soggetto principale (coniglio ~ z=-140)
  controls.target.set(0, player.height, -140);
  controls.update();

  // ====== RESIZE ======
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // ====== VISIBILITY (risparmia batteria) ======
  let rafId = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      animate();
    }
  });

  // ====== CONTEXT LOST / RESTORED ======
  const gl = renderer.getContext();
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn('WebGL context lost');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    console.warn('WebGL context restored');
    onResize();
    animate();
  });

  // ====== LOADER MANAGER (opzionale: chiudi loader UI quando pronto) ======
  const loadingManager = new THREE.LoadingManager(
    // onLoad
    () => {
      const ld = document.getElementById('loader');
      if (ld) ld.style.display = 'none';
    },
    // onProgress
    (url, itemsLoaded, itemsTotal) => {
      // console.log(`Caricati ${itemsLoaded}/${itemsTotal}: ${url}`);
    },
    // onError
    (url) => {
      console.error('Errore nel caricamento:', url);
      const errBox = document.getElementById('threejs-error');
      if (errBox) {
        errBox.style.display = 'block';
        errBox.textContent = 'Errore nel caricamento delle risorse 3D.';
      }
    }
  );

  const gltfLoader = new GLTFLoader(loadingManager);

  // ====== MODELLI ======
  // 1) Buco Home
  gltfLoader.load(
    '3d/CV_Home_Hole.glb',
    (gltf) => {
      const model = gltf.scene;
      model.position.set(25, 0, -260);
      model.rotation.set(0, Math.PI / 2, Math.PI / 2);
      model.scale.set(0.65, 0.65, 0.65);
      scene.add(model);
    },
    undefined,
    (err) => console.error('GLTF Hole error:', err)
  );

  // 2) Coniglio (modelB) — usato per l’animazione su scroll
  let modelB = null;
  gltfLoader.load(
    '3d/CV_Black_Rabbit.glb',
    (gltf) => {
      modelB = gltf.scene;
      modelB.position.set(-9, -32, -138);
      modelB.rotation.set(0, Math.PI / 2.7, 0);
      modelB.scale.set(10, 10, 10);
      scene.add(modelB);
    },
    undefined,
    (err) => console.error('GLTF Rabbit error:', err)
  );

  // ====== SCROLL LOGIC (leggero) ======
  function moveCameraOnScroll() {
    const t = window.scrollY || 0; // più leggero di getBoundingClientRect
    // Avanza la camera lungo Z verso i modelli con damping semplice
    camera.position.z = 30 + t * 0.15; // valori positivi: la camera si muove avanti
    camera.rotation.y = -t * 0.0001;
  }

  function moveModelBOnScroll() {
    if (!modelB) return;
    const t = window.scrollY || 0;
    modelB.position.z = -140 + (t * 0.15);
    modelB.position.x = -4 - (t * 0.0002);
    modelB.rotation.y = Math.PI / 2.7 - t * 0.001;
  }

  function onScroll() {
    moveCameraOnScroll();
    moveModelBOnScroll();
  }
  // Attiva lo scroll
  window.addEventListener('scroll', onScroll, { passive: true });

  // ====== ANIMATE LOOP ======
  function animate() {
    // safety: se il contesto è perso, non fare render
    if (gl.isContextLost && gl.isContextLost()) return;

    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // ====== DIAGNOSTICA MINIMA ======
  window.onerror = function (msg, url, line, col, err) {
    console.log('[ERROR]', msg, url, line, col, err && err.stack);
  };

  // (Facoltativo) Log capacità renderer
  // console.log('Renderer caps:', renderer.capabilities);
}
