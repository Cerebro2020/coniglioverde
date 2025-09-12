// ./js/index.js
import * as THREE from 'three';
import { OrbitControls } from '../three_class/OrbitControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function () {
  // ====== CANVAS & RENDERER (mobile-safe) ======
  const canvas = document.getElementById('conigliobcg');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,          // smartphone-safe
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;  // evitare problemi su mobile

  // ====== SCENA ======
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 45, 180);

  // ====== CAMERA (come nel tuo originale) ======
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  const player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
  camera.position.set(0, 0, 0);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));
  camera.setFocalLength(35);

  // ====== LUCI ======
  const ambiente = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambiente);

  // ====== ORBIT CONTROLS (distanza bloccata come prima) ======
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, player.height, 0);
  controls.minDistance = 30;
  controls.maxDistance = 30;
  controls.update();

  // ====== RESIZE ======
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // ====== VISIBILITY SAVE BATTERY ======
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
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); });
  canvas.addEventListener('webglcontextrestored', () => { onResize(); animate(); });

  // ====== LOADING MANAGER ======
  const loadingManager = new THREE.LoadingManager(
    () => { const ld = document.getElementById('loader'); if (ld) ld.style.display = 'none'; },
    undefined,
    (url) => {
      console.error('Errore nel caricamento:', url);
      const err = document.getElementById('threejs-error');
      if (err) { err.style.display = 'block'; err.textContent = 'Errore nel caricamento delle risorse 3D.'; }
    }
  );
  const gltfLoader = new GLTFLoader(loadingManager);

  // ====== MODELLI ======
  // HOLE - HOME
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

  // RABBIT - modelB (animato con lo scroll)
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

  // ====== SCROLLING (formule IDENTICHE al tuo file) ======
  function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.set(0, 0, t * 0.15);
    camera.rotation.set(0, -(t * 0.0001), 0);
  }

  function moveModelB() {
    const t = document.body.getBoundingClientRect().top;
    if (modelB) {
      modelB.position.z = -140 + (t * 0.15);
      modelB.position.x = -4 - (t * 0.0002);
      modelB.rotation.y = Math.PI / 2.7 - t * 0.001;
    }
  }

  window.addEventListener('scroll', () => {
    moveCamera();
    moveModelB();
  }, { passive: true });

  // ====== ANIMATE LOOP ======
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // ====== DIAGNOSTICA MINIMA ======
  window.onerror = function (msg, url, line, col, err) {
    console.log('[ERROR]', msg, url, line, col, err && err.stack);
  };
}
