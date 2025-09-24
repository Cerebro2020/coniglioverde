import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';
export default function(){
  // SCENE  
  const scene = new THREE.Scene();  
  //CAMERA
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };  //RENDERER
  const renderer = new THREE.WebGLRenderer({    
    alpha:true, 
    antialias:true}) ;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement ); 
  // RESIZE WINDOW
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  } );
  // TEXTURS
  const loader = new THREE.TextureLoader();
  const Texture = loader.load('images//bcg/SfondoI2.jpg');
  Texture.wrapS = THREE.RepeatWrapping;
  Texture.wrapT = THREE.RepeatWrapping;
  Texture.repeat.set(10, 10);
  const Texture2 = loader.load('images/bcg/SfondoI2.jpg');
  // CAMERA
  camera.position.set( 0, 0, 0);
  camera.lookAt(new THREE.Vector3( 0, player.height, 0)); 
  camera.setFocalLength ( 35 );
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 0.9)
  scene.add( ambiente);
    //POINT
    const pointLight = new THREE.PointLight( 0xffffff, 0.6, 100); 
    pointLight.position.set(0, 0, -30);
    scene.add( pointLight);   
    const pointLight2 = new THREE.PointLight( 0xffffff, 0.6, 100); 
    pointLight2.position.set(0, 0, 30);
    scene.add( pointLight2);   
    const pointLight3 = new THREE.PointLight( 0xffffff, 0.6, 100); 
    pointLight3.position.set(10, 0, -30);
    scene.add( pointLight3);     
  // ANIMATE SCENE
  function animateScene(){
    requestAnimationFrame( animateScene );
    renderer.render( scene, camera );  };
  animateScene();
  // ORBIT CONTROLS
  const controls = new OrbitControls( camera, renderer.domElement );  
  controls.listenToKeyEvents( window ); 
  controls.minDistance = 30;
  controls.maxDistance = 30;
  //SCROLLING
  function moveCamera () {
    const t = document.body.getBoundingClientRect().top;
    // camera.position.set( 0, t*0.02, t*0.002 );
    camera.position.set( 0, t*0.0025, 0 );  
    camera.rotation.set( 0, -(t/20000), 0 );     
  }
  document.body.onscroll = moveCamera;
  
 

  // ANIMAZIONE
  function animate(time) {
    requestAnimationFrame(animate);

    const t = time * 0.0001; 
    // scene.rotation.z = t * 0.25; 
    camera.rotation.y = t * 0.25; 
    // scene.rotation.x = Math.sin(t) * 0.02;

    renderer.render(scene, camera);
  }
  animate();

};