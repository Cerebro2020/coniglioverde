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
    pointLight.position.set(0, 60, -30);
    scene.add( pointLight);   
    const pointLight2 = new THREE.PointLight( 0xffffff, 0.6, 100); 
    pointLight2.position.set(0, 0, -30);
    scene.add( pointLight2);   
    const pointLight3 = new THREE.PointLight( 0xffffff, 0.6, 100); 
    pointLight3.position.set(10, -40, -30);
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
  // HEARTS
  const loaderHeart = new GLTFLoader();   
  loaderHeart.load('3d/heart/heart.glb',
    function (gltfg) {
      const heart = gltfg.scene;
      heart.position.set( 12, -4, -34 );      
      heart.rotation.set( 0, 0, 0 );
      heart.scale.set( 4, 4, 4 );
      heart.traverse(function (node) {
        if (node.isMesh) {          
          const material = new THREE.MeshPhysicalMaterial({
            color: 0xf20190,
            map: Texture2,
            roughness: 0,
            metalness: 0,                            
          });         
          node.material = material;                  
        }    
      });
      scene.add(heart);
      let heart2 = heart.clone();      
      heart2.position.set(-24, 1016, -164 );
      heart2.scale.set( 10, 10, 10 );
      heart2.rotation.set(0.1,0.2,0.20);
      scene.add(heart2);
    },       
    undefined, // funzione di progresso opzionale da passare al caricatore
    function (error) {
      console.error(error);      
    } 
  );  
  // SFERA
  const gSfera = new THREE.SphereGeometry( 5, 32, 32 );
  const materialN = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: Texture2,
    roughness: 0,
    metalness: 0,
  });
  // SFERA
  let sfera = new THREE.Mesh( gSfera, materialN );
  sfera.position.set(-12 , 8.5, -48);
  scene.add(sfera);
  let sfera2 = sfera.clone();
  sfera2.position.set(-20, -6, -60);
  scene.add(sfera2);  
  // CUBE
  const gBox = new THREE.BoxGeometry( 4, 4, 4 ); 
  const Box = new THREE.Mesh( gBox, materialN );
  // BOX 1 
  Box.position.set( 2, -8, -40 );
  Box.rotation.set( 0, -0.4, 0.5 );
  // BOX 1 
  let Box2 = Box.clone();
  Box2.position.set( 8, 6, -40 );
  Box2.rotation.set( 0, 0.4, -0.5 );
  scene.add( Box, Box2 );
  // BOX 1 
  let Box3 = Box.clone();
  Box3.position.set( -4, -6, -20 );
  Box3.rotation.set( 0, -0.4, 0.5 );
  scene.add( Box, Box2, Box3 );
  //PIRAMID
  const gPiramid = new THREE.ConeGeometry( 10, 20, 3 ); 
  let piramid = new THREE.Mesh( gPiramid, materialN );
  piramid.position.set( 0, -58, -120 );
  piramid.rotation.set( 0, -2, -0.5 );
  let piramid2 = piramid.clone();
  piramid2.position.set( 35, -25, -120 );
  piramid2.rotation.set( 0.7, 0.2, -0.6 );
  scene.add( piramid, piramid2 ); 
  // OCTAGON
  const gOctagon = new THREE.OctahedronGeometry( 4, 1 ); 
  let octagon = new THREE.Mesh( gOctagon, materialN );
  octagon.position.set( 22, 2, -70 );
  octagon.rotation.set( -0.2, 2, -1.5 );
  let octagon2 = octagon.clone();
  octagon2.position.set( -15, -18, -40 );
  octagon2.rotation.set( 0.2, 2, -0.5 );
  let octagon3 = octagon.clone();
  octagon3.position.set( -4, 18, -150 );
  octagon3.rotation.set( 0.2, 2, -0.5 );
  scene.add( octagon, octagon2, octagon3 ); 

  // ANIMAZIONE
  function animate(time) {
    requestAnimationFrame(animate);

    const t = time * 0.0001; 
    scene.rotation.z = t * 0.25; 
    scene.rotation.y = t * 0.25; 
    // scene.rotation.x = Math.sin(t) * 0.02;

    renderer.render(scene, camera);
  }
  animate();

};