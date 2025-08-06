import * as THREE from 'three';
import {OrbitControls} from '../three_class/OrbitControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';
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
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement ); 
  // RESIZE WINDOW
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  } );  
  // SCENE & FOG
  scene.background = new THREE.Color( 0x000000 );
  scene.fog = new THREE.Fog( 0x000000, 40, 180);  
  // CAMERA
  camera.position.set( 0, 0, 0);
  camera.lookAt(new THREE.Vector3( 0, player.height, 0)); 
  camera.setFocalLength ( 35 );
  // LIGHTS  
  const ambiente = new THREE.AmbientLight ( 0xFFFFFF, 1 )
  scene.add( ambiente);    
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
  // SCROLLING
  function moveCamera () {
    const t = document.body.getBoundingClientRect().top;
    camera.position.set( 0, 0, t * 0.15 );   
    camera.rotation.set( 0, -(t * 0.0001), 0 );   
  }
  document.body.onscroll = moveCamera;
  
  // HOLE - HOME  
  const loaderBuco = new GLTFLoader();
  loaderBuco.load('3d/CV_Home_Hole.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model); // Aggiungi il modello alla scena
    model.position.set(25, 0, -260);
    model.rotation.set(0, Math.PI/2, Math.PI/2);
    model.scale.set(0.65,0.65,0.65);
  });
  // RABBIT - HOME
  const loaderRabbitB = new GLTFLoader();
  loaderRabbitB.load('3d/CV_Black_Rabbit.glb', (gltf) => {
    const modelB = gltf.scene;
    scene.add(modelB); // Aggiungi il modello alla scena
    modelB.position.set(-9, -12, -48);
    modelB.rotation.set(0, Math.PI/2.7, 0);
    modelB.scale.set(4,4,4);
    let rabbitB = modelB.clone();
      rabbitB.position.set( -3, -8, -520 );
      rabbitB.scale.set(2,2,2); 
      rabbitB.rotation.set( 0, -2, 0 );     
      scene.add( rabbitB ); 
  });
};