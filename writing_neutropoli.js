import * as THREE from 'three';
import {FirstPersonControls} from './three_class/FirstPersonControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';

export default function(){

  const clock = new THREE.Clock();
  window.resetCamera = resetCamera;

  // SCENE  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x008888 );  
  scene.fog = new THREE.Fog(0x008888, 10, 100);

  //CAMERA
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.set( 0, 0, -200 );

  // PLAYER
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

  //RENDERER
  const renderer = new THREE.WebGLRenderer({    
    alpha:true, 
    antialias:true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
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
  // const gridHelper = new THREE.GridHelper( 250,50 );  
  //scene.add(gridHelper);

  // CAMERA  
  camera.lookAt(new THREE.Vector3( 0, player.height, 10));
  camera.lookAt( 0, 60, 800); 
  camera.setFocalLength ( 25 );

  // CONTROLS
  const controls = new FirstPersonControls(camera, renderer.domElement);    
  controls.movementSpeed = 4;
  controls.lookSpeed = 0.015;

  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 0.5 )
  scene.add( ambiente);
  let int = 1;
  let dist = 10;
  let decay = 0.7;
  let pointcolor = 0Xddddff;
  //let yp = 50;
  //POINT
  const pointLight = new THREE.PointLight( pointcolor, int, dist, decay); 
  pointLight.position.set( -20, 4, -116 );
  const pointLight2 = new THREE.PointLight( pointcolor, int, dist, decay);    
  pointLight2.position.set( 0, 0, 0);
  const pointLight3 = new THREE.PointLight( pointcolor, int, dist, decay); 
  pointLight3.position.set( 40, 0, 100 );
  const pointLight4 = new THREE.PointLight( pointcolor, int, dist, decay); 
  pointLight4.position.set( 0, 0, -150 ); 
  const helper1 = new THREE.PointLightHelper(pointLight);
  const helper2 = new THREE.PointLightHelper(pointLight2);
  const helper3 = new THREE.PointLightHelper(pointLight3);
  const helper4 = new THREE.PointLightHelper(pointLight4);  
  // scene.add( helper1, helper2,helper3, helper4);
  scene.add( pointLight, pointLight2,pointLight3,pointLight4 );
  pointLight.castShadow = true;

  //TEXTURES
  const loader = new THREE.TextureLoader();
  const texture1 = loader.load('./images/statics/Glitches/glitches_01 (6).jpg'); 
  const texture2 = loader.load('./images/statics/Glitches/glitches_01 (3).jpg');
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.wrapT = THREE.RepeatWrapping;
  texture2.repeat.set(2,2);  
  
  //AUDIO
  // POETRY 1
  var listenerEmme = new THREE.AudioListener();
  camera.add(listenerEmme);  
  var soundEmme = new THREE.Audio(listenerEmme); 
  var loaderEmme = new THREE.AudioLoader(); 
  loaderEmme.load('./audio/neutropoli/01_emme_uno.mp3', function(buffer) {
    soundEmme.setBuffer(buffer);
    soundEmme.setLoop(true);
    soundEmme.setVolume(0.5);
    //soundEmme.play();
  });
  // POETRY 2
  var listenerFotogramma = new THREE.AudioListener();
  camera.add(listenerFotogramma);  
  var soundFotogramma = new THREE.Audio(listenerEmme);
  var loaderFotogramma = new THREE.AudioLoader();   
  loaderFotogramma.load('./audio/neutropoli/20_fotogramma.mp3', function(buffer) {
    soundFotogramma.setBuffer(buffer);
    soundFotogramma.setLoop(true);
    soundFotogramma.setVolume(0.5);
    //soundFotogramma.play();
  });
   // POETRY 3
   var listenerChiaha = new THREE.AudioListener();
   camera.add(listenerChiaha);  
   var soundChiha = new THREE.Audio(listenerChiaha);
   var loaderChiha = new THREE.AudioLoader(); 
   
   loaderChiha.load('./audio/neutropoli/02_chi_ha.mp3', function(buffer) {
    soundChiha.setBuffer(buffer);
    soundChiha.setLoop(true);
    soundChiha.setVolume(0.5);
    //soundChiha.play();
   });
   // POETRY 4
   var listenerCiocca = new THREE.AudioListener();
   camera.add(listenerCiocca);  
   var soundCiocca = new THREE.Audio(listenerCiocca);
   var loaderCiocca = new THREE.AudioLoader();    
   loaderCiocca.load('./audio/neutropoli/04_una_ciocca.mp3', function(buffer) {
    soundCiocca.setBuffer(buffer);
    soundCiocca.setLoop(true);
    soundCiocca.setVolume(0.5);
    //soundCiocca.play();
   });
   // POETRY 5
   var listenerAccavalla= new THREE.AudioListener();
   camera.add(listenerAccavalla);  
   var soundAccavalla = new THREE.Audio(listenerAccavalla);
   var loaderAccavalla = new THREE.AudioLoader();   
   loaderAccavalla.load('./audio/neutropoli/03_se_accavalla.mp3', function(buffer) {
    soundAccavalla.setBuffer(buffer);
    soundAccavalla.setLoop(true);
    soundAccavalla.setVolume(0.5);
    //soundAccavalla.play();
  });     
  // POETRY 6
  var listenerPeriferia= new THREE.AudioListener();
  camera.add(listenerPeriferia);  
  var soundPeriferia = new THREE.Audio(listenerPeriferia);
  var loaderPeriferia = new THREE.AudioLoader();      
  loaderPeriferia.load('./audio/neutropoli/11_alla_periferia.mp3', function(buffer) {
    soundPeriferia.setBuffer(buffer);
    soundPeriferia.setLoop(true);
    soundPeriferia.setVolume(0.5);
    //soundPeriferia.play();
  });  

  // BACKGROUND 1
  const listenerBcg = new THREE.AudioListener();
  camera.add(listenerBcg);
  const audioLoader = new THREE.AudioLoader();
  const backgroundSound = new THREE.Audio( listenerBcg );
  audioLoader.load('audio/neutropoli/Milano_Background_metro.m4a', function( buffer ) {
    backgroundSound.setBuffer( buffer );
    backgroundSound.setLoop( true );
    backgroundSound.setVolume( 0.075);
    backgroundSound.play();
  });
  // BACKGROUND 2
  const listenerBcg2 = new THREE.AudioListener();
  camera.add(listenerBcg2);
  const audioLoader2 = new THREE.AudioLoader();
   const backgroundSound2 = new THREE.Audio( listenerBcg2 );
    audioLoader2.load('audio/neutropoli/attraction.m4a', function( buffer ) {
    backgroundSound2.setBuffer( buffer );
    backgroundSound2.setLoop( true );
    backgroundSound2.setVolume( 0.125 );
    backgroundSound2.play();
  });

  // Selezioniamo i pulsanti //
  let cameraButton = document.querySelector('#btn-camera button');   
  cameraButton.addEventListener('click', function() {
    resetCamera();
  });  
  function resetCamera() {
    camera.position.set(  0, 0, -150 ); 
    camera.rotation.set( 1, 0, 0 );
    camera.lookAt(new THREE.Vector3( 0, player.height, 0)); 
    controls.listenToKeyEvents( window );
    controls.minDistance =  5;    
    controls.maxDistance = 1400;
    controls.maxPolarAngle = 1.5; 
  }
  let audioButton = document.querySelector('#btn-audio button');
  let isPlaying = true;
  audioButton.addEventListener('click', function() {
    if (isPlaying) {
      backgroundSound.pause();
      backgroundSound2.pause();
      soundEmme.pause();
      soundFotogramma.pause();
      soundChiha.pause();
      soundCiocca.pause();
      soundAccavalla.pause();
      soundPeriferia.pause();
    } else {
      backgroundSound.play();
      backgroundSound2.play();
      soundEmme.play();
      soundFotogramma.play();
      soundChiha.play();
      soundCiocca.play();
      soundAccavalla.play();
      soundPeriferia.play();
    }
    isPlaying = !isPlaying;
  });
  // SPEAKER - emme  
  const speakerLoader = new GLTFLoader();
  speakerLoader.load(    
    './3d/humans/Low_person_3.glb',
    function (glt) {
      const speakerEmme = glt.scene;
      speakerEmme.position.set(-2,-7.5,-50);
      speakerEmme.rotation.set( 0, -Math.PI/2, 0 );      
      speakerEmme.scale.set( 12, 12, 12 );        
      speakerEmme.traverse(function (node) {
        if (node.isMesh) { 
          const materialSGL = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, 
            emissive: 0x000000,
            map: texture2,  
            roughness: 0,
            metalness: 0.5,
            clearcoat: 0,
            ior: 0.152,
            sheen: 0.5,
          });  
          node.material = materialSGL;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });          
      speakerEmme.castShadow = true; 
      speakerEmme.receiveShadow = true; 
      // fotogramma
      let speakerFotogramma = speakerEmme.clone();
      // chi ha
      let speakerChiHa = speakerEmme.clone();
      // ciocca
      let speakerCiocca = speakerEmme.clone();
      // accavalla
      let speakerAccavalla = speakerEmme.clone();
      //periferia
      let speakerPeriferia = speakerEmme.clone();
      speakerFotogramma.position.set(0,-27,50);
      speakerChiHa.position.set(-21,-7.5,-110);
      speakerCiocca.position.set(-22,13,50);
      speakerAccavalla.position.set(22,-27,-50);
      speakerPeriferia.position.set(-22,13,-50);
      scene.add(speakerEmme,speakerFotogramma, speakerChiHa, speakerCiocca, speakerAccavalla, speakerPeriferia);

      // AUDIO DISTANCE  
      function animateScene(){
        requestAnimationFrame( animateScene );   
        controls.update(clock.getDelta());
        renderer.render( scene, camera );

        var distance = camera.position.distanceTo(speakerEmme.position); 
        var distance2 = camera.position.distanceTo(speakerFotogramma.position);
        var distance3 = camera.position.distanceTo(speakerChiHa.position);
        var distance4 = camera.position.distanceTo(speakerCiocca.position);
        var distance5 = camera.position.distanceTo(speakerAccavalla.position);
        var distance6 = camera.position.distanceTo(speakerPeriferia.position);

        var volume = 1 - Math.min(distance / 20, 1); 
        var volume2 = 1 - Math.min(distance2 / 20, 1); 
        var volume3 = 1 - Math.min(distance3 / 20, 1);      
        var volume4 = 1 - Math.min(distance4 / 20, 1);  
        var volume5 = 1 - Math.min(distance5 / 20, 1);  
        var volume6 = 1 - Math.min(distance6 / 20, 1); 

        soundEmme.setVolume(volume);
        soundFotogramma.setVolume(volume2)
        soundChiha.setVolume(volume3)
        soundCiocca.setVolume(volume4);
        soundAccavalla.setVolume(volume5);
        soundPeriferia.setVolume(volume6);     

        if (!soundEmme.isPlaying && volume > 0) {
          soundEmme.play();
        } else if ( volume <= 0){          
          soundEmme.play();
          soundEmme.stop();                      
        }
        if (!soundFotogramma.isPlaying && volume2 > 0) {
          soundFotogramma.play(); 
        } else if ( volume2 <= 0){          
          soundFotogramma.play();
          soundFotogramma.stop();
        }
        if (!soundChiha.isPlaying && volume3 > 0) {
          soundChiha.play();
        } else if ( volume3 <= 0){
          soundChiha.play();
          soundChiha.stop(); 
        }
        if (!soundCiocca.isPlaying && volume4 > 0) {
          soundCiocca.play();
        } else if ( volume4 <= 0){
          soundCiocca.play();
          soundCiocca.stop();
        }
        if (!soundAccavalla.isPlaying && volume5 > 0) {
          soundAccavalla.play();;
        } else if ( volume5 <= 0){
          soundAccavalla.play();
          soundAccavalla.stop();
        }
        
         if (!soundPeriferia.isPlaying && volume5 > 0) {
          soundPeriferia.play();;
        } else if ( volume5 <= 0){
          soundPeriferia.play();
          soundPeriferia.stop();
        }  
                

        if (soundEmme.isPlaying || soundFotogramma.isPlaying || soundChiha.isPlaying || soundCiocca.isPlaying || soundAccavalla.isPlaying ||
        soundPeriferia.isPlaying
        ) {
          backgroundSound.setVolume(0.06);
        } else {
          backgroundSound.setVolume(0.2);
        }
        
        soundEmme.setVolume(volume)
        soundFotogramma.setVolume(volume2)
        soundChiha.setVolume(volume3)
        soundCiocca.setVolume(volume4)
        soundAccavalla.setVolume(volume5)
        soundPeriferia.setVolume(volume6)
      };
      animateScene();
    }, 
    undefined, 
    function (error) {
      console.error(error);      
    }
  );

  // SUBWAY GLB
  const subwayGLoader = new GLTFLoader();
  subwayGLoader.load(    
   './3d/subway/subway6.glb',
    function (glt) {
      const subwayG = glt.scene;
      subwayG.position.set( 0, 0, 0 );
      subwayG.rotation.set( 0, -Math.PI/2, 0 );      
      subwayG.scale.set( 3, 3, 3 );        
      subwayG.traverse(function (node) {
        if (node.isMesh) {
          const materialSGL = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, 
            emissive: 0x000000,
            map: texture1,  
            bumpMap: texture1, 
            bumpScale: 0.1,     
            roughness: 0.5,
            metalness: 0.5,
          }); 
          node.material = materialSGL;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });        
      scene.add(subwayG);        
      subwayG.castShadow = true; 
      subwayG.receiveShadow = true; 
    }, 
    undefined, // funzione di progresso opzionale da passare al caricatore
    function (error) {
    console.error(error);      
    } 
  );

// CAMERA POSITION
  let positions = [ 
    {moveTime: 10, waitTime: 1, pos: {x:0,y:0,z:-200}},/*partenza*/
    {moveTime: 10, waitTime: 51, pos: {x:-22,y:3,z:-108}},/*ChiHa*/   
    {moveTime: 10, waitTime: 91, pos: {x:-2,y:4.5,z:-40}},/*Emme1*/     
    {moveTime: 10, waitTime: 1, pos: {x:-20,y:24,z:-42}},/*Null_1*/
    {moveTime: 10, waitTime: 42, pos: {x:-20,y:24,z:50}},/*Cioc*/
    {moveTime: 10, waitTime: 51, pos: {x:22,y:-20,z:-52}},/*Acca*/
    {moveTime: 10, waitTime: 40, pos: {x:0,y:-15,z:50}},/*Fotog*/
    {moveTime: 10, waitTime: 58, pos: {x:-22,y:20,z:-52}},/*Periferia*/
  ];  

  let tweenScene = function(index) {
    if (index >= positions.length) index = 0;  
    gsap.to(camera.position, {
      duration: positions[index].moveTime,
      x: positions[index].pos.x,
      y: positions[index].pos.y,
      z: positions[index].pos.z,
      onComplete: function() {
        gsap.delayedCall(positions[index].waitTime, function() {
          tweenScene(index + 1);
        });
      }    
    });
  };  
  tweenScene(0);
  let rotations = [
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}},    
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}},
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}},
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}},
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}},    
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}},
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}},
    {moveTime: 4, waitTime: 10, pos: {x:0,y:0, z:0}}, 
  ];  
  let tweenSceneR = function(index) {
    if (index >= rotations.length) index = 0;
  
    gsap.to(scene.rotation, {
      duration: rotations[index].moveTime,
      x: rotations[index].pos.x,
      y: rotations[index].pos.y,
      z: rotations[index].pos.z,
      onComplete: function() {
        gsap.delayedCall(rotations[index].waitTime, function() {
          tweenSceneR(index + 1);
        });
      }    
    });
  };
  
  tweenSceneR(0);
  animate();
};