import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';
export default function(){
  // SCENE  
  const scene = new THREE.Scene();  
  //CAMERA
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
  camera.position.set(0, 0, 0);
  camera.lookAt(new THREE.Vector3( 0, player.height, 0)); 
  camera.setFocalLength ( 35 );
  //RENDERER
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
  const bumpP = loader.load ('./images/textures/bump_planet_3.jpg');
  bumpP.wrapS = THREE.RepeatWrapping;
  bumpP.wrapT = THREE.RepeatWrapping;
  bumpP.repeat.set( 2, 800);
  // SCENE & FOG
  scene.background = new THREE.Color( 0x000000 );
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xFFFFFF, 0 )
  scene.add( ambiente);
  // POINT
  const point = new THREE.PointLight(0xFFFFFF,2,150);
  point.position.set(5,0.2,-28);
  scene.add(point);
  let helperP = new THREE.PointLightHelper(point);
  // scene.add(helperP);
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
  // GALLERY HOLE
  const loaderPlanet = new GLTFLoader();
  loaderPlanet.load('3d/CV_Static_Hole_2.glb', (gltf) => {
    const model = gltf.scene;
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;    
        node.receiveShadow = true; 
      }
    });
    scene.add(model);
    model.position.set(0,0,0);
    model.rotation.set(0,0,0);
    model.rotation.set(0,0,0.0);
    let MS = 5;
    model.scale.set(MS,MS,MS); 
    
    //SCROLLING
  function moveCamera () {
    const t = document.body.getBoundingClientRect().top;
    // camera.position.set( (t/20000), t * 0.0075, 0 );
    let fac = (t/100) * 0.015;
    model.rotation.set(0,fac,0);    
  }
  document.body.onscroll = moveCamera;

  });
  
};