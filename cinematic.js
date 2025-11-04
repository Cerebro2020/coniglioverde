import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';
export default function(){
  // SCENE  
  const scene = new THREE.Scene();
  //CAMERA
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
  //RENDERER
  const renderer = new THREE.WebGLRenderer({    
    alpha:true, 
    antialias:true}) ;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement ); 
   // === RESIZE WINDOW ===
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);  
  });
  // VIDEO  
  // VIDEO 1
  var video1 = document.createElement('video');
  video1.src = "./video/cinematic/butterfly_spot.mp4";
  video1.style.display = 'none';
  video1.muted = true; 
  video1.loop = true; 
  document.body.appendChild(video1); 
  video1.load();
  video1.play();
  var vTexture1 = new THREE.VideoTexture(video1);
  vTexture1.minFilter = THREE.LinearFilter;
  vTexture1.magFilter = THREE.LinearFilter;
  vTexture1.format = THREE.RGBAFormat;
  // VIDEO 2
  var video2 = document.createElement('video');
  video2.src = "./video/cinematic/02_genomachines.mp4";
  video2.style.display = 'none';
  video2.muted = true;  
  video2.loop = true; 
  document.body.appendChild(video2);  
  video2.load();
  video2.play();
  var vTexture2 = new THREE.VideoTexture(video2);
  vTexture2.minFilter = THREE.LinearFilter;
  vTexture2.magFilter = THREE.LinearFilter;
  vTexture2.format = THREE.RGBAFormat;
  // SCENE & FOG
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000,1,170);     
  // CAMERA
  camera.position.set( 0, 0, 0);
  camera.lookAt(new THREE.Vector3( 0, player.height, 0)); 
  camera.setFocalLength ( 35 );
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 0.3 )
  scene.add( ambiente);
  //POINT
  const pointLight = new THREE.PointLight( 0xffffff, 0.5, 100); 
  pointLight.position.set( 0, 0, -40 );
  const pointLight2 = new THREE.PointLight( 0xffffff, 0.5, 100);    
  pointLight2.position.set(0,0, -79);   
  // scene.add( pointLight, pointLight2);
  
  // ANIMATE SCENE
  function animateScene(){
    requestAnimationFrame( animateScene );
    renderer.render( scene, camera );
  };
  animateScene();
  // ORBIT CONTROLS
  const controls = new OrbitControls( camera, renderer.domElement );  
  controls.listenToKeyEvents( window ); 
  controls.minDistance = 30;
  controls.maxDistance = 30;
  //SCROLLING
  function moveCamera () {
    const t = document.body.getBoundingClientRect().top;
    camera.position.set( 0, 0, t * 0.01 );    
  }
  document.body.onscroll = moveCamera;
  // 3D
  const loaderPlanet = new GLTFLoader();
  loaderPlanet.load('3d/cinematic/Cinematic_Hole.glb', (gltf) => {
    const model = gltf.scene;
    // Attiva proiezione e ricezione ombre per ogni mesh nel modello
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;    // Proietta ombre
        node.receiveShadow = true; // Riceve ombre
      }
    });
    scene.add(model); // Aggiungi il modello alla scena
    model.position.set(0, 0, -70);
    model.rotation.set(Math.PI/2,0,0);
    let MS = 5;
    model.scale.set(MS,MS,MS);     
  });
};