// ./js/index.js
import * as THREE from 'three';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function(){
  // ====== RENDERER su canvas esistente (mobile-safe) ======
  const canvas = document.getElementById('conigliobcg');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:false,
    alpha:false,
    powerPreference:'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;

  // ====== SCENA ======
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 35, 180);

  // ====== CAMERA (identica al tuo setup base) ======
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 10000);
  const player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
  camera.position.set(0, 0, 0);
  // camera.lookAt(new THREE.Vector3(0, player.height, 0));
  camera.setFocalLength(35);

  // ====== LUCI ======
  const ambiente = new THREE.AmbientLight(0xFFFFFF, 1.2);
  // const rabbitLight = new THREE.PointLight(0xFFFFFF, 1, 500);
  // const helper = new THREE.PointLightHelper(rabbitLight);
  // rabbitLight.position.set(8,-14,-340);
  scene.add(ambiente);

  // ====== RESIZE ======
  window.addEventListener('resize', ()=>{
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ====== MODELLI ======
  const manager = new THREE.LoadingManager(
    ()=>{ const ld=document.getElementById('loader'); if(ld) ld.style.display='none'; },
    undefined,
    (url)=>{ console.error('Errore caricamento:', url);
      const e=document.getElementById('threejs-error'); if(e){e.style.display='block'; e.textContent='Errore nel caricamento delle risorse 3D.';}
    }
  );
  const loader = new GLTFLoader(manager);

  let holeLoaded = false;
let hole = null;
let rabbit = null;


  loader.load(
  '3d/home/CV_Home_Hole.glb',
  (gltf)=>{
    hole = gltf.scene;
    hole.position.set(25, 0, -260);
    hole.rotation.set(0, Math.PI/2, Math.PI/2);
    hole.scale.set(0.65,0.65,0.65);
    scene.add(hole);

    holeLoaded = true;

    // quando il tunnel è pronto --> carica rabbit
    loadRabbit();
  }
);

  // 2) FUNZIONE CHE CARICA RABBIT SOLO DOPO IL TUNNEL
function loadRabbit(){
  loader.load(
    '3d/home/CV_Black_Rabbit.glb',
    (gltf)=>{
      rabbit = gltf.scene;
      rabbit.visible = false;

      rabbit.position.set(-9, -32, -138);
      rabbit.rotation.set(0, Math.PI/2.7, 0);
      rabbit.scale.set(10,10,10);
      scene.add(rabbit);

      // Rabbit appare SOLO dopo che Hole è sicuro in scena
      setTimeout(()=>{ rabbit.visible = true; }, 200);
    }
  );
}

  // ====== SCROLL (formule identiche alle tue) ======
  function moveCamera(){
    const t = document.body.getBoundingClientRect().top;
    camera.position.set(0, 0, t * 0.15);
    camera.rotation.set(0, -(t * 0.0001), 0);
  }
  function moveModelB(){
    const t = document.body.getBoundingClientRect().top;
    if(modelB){
      modelB.position.z = -140 + (t * 0.15);
      modelB.position.x = -4 - (t * 0.0002);
      modelB.rotation.y = Math.PI/2.7 - t * 0.001;
    }
  }
  window.addEventListener('scroll', ()=>{
    moveCamera(); moveModelB();
  }, {passive:true});

  // ====== ANIMATE ======
  let rafId = null;
  function animate(){
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // ====== CONTEXT LOST/RESTORE ======
  canvas.addEventListener('webglcontextlost', (e)=>{ e.preventDefault(); });
  canvas.addEventListener('webglcontextrestored', ()=>{ animate(); });

  // ====== DIAGNOSTICA ======
  window.onerror = function(msg,url,line,col,err){
    console.log('[ERROR]', msg, url, line, col, err && err.stack);
  };
}