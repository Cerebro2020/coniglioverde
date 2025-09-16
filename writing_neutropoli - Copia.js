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
  camera.position.set( 0, 0, -150 );
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
  controls.movementSpeed = 6;
  controls.lookSpeed = 0.015;
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 0.5 )
  scene.add( ambiente);
  let int = 0.15;
  let dist = 1000;
  let decay = 0.5;
  let pointcolor = 0Xddddff;
  //let yp = 50;
  //POINT
  const pointLight = new THREE.PointLight( pointcolor, int, dist, decay); 
  pointLight.position.set( -40, 0, -100 );
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
  //scene.add( helper1, helper2,helper3, helper4);
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
  loaderEmme.load('./audio/neutropoli/Emme.mp3', function(buffer) {
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
  loaderFotogramma.load('./audio/neutropoli/Fotogramma.m4a', function(buffer) {
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
   
   loaderChiha.load('./audio/neutropoli/chiha.mp3', function(buffer) {
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
   loaderCiocca.load('./audio/neutropoli/ciocca.mp3', function(buffer) {
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
   loaderAccavalla.load('./audio/neutropoli/accavalla.mp3', function(buffer) {
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
  loaderPeriferia.load('./audio/neutropoli/periferia.mp3', function(buffer) {
    soundPeriferia.setBuffer(buffer);
    soundPeriferia.setLoop(true);
    soundPeriferia.setVolume(0.5);
    //soundPeriferia.play();
  });  
  // BACKGROUND 
  const listenerBcg = new THREE.AudioListener();
  camera.add(listenerBcg);
  const audioLoader = new THREE.AudioLoader();
  const backgroundSound = new THREE.Audio( listenerBcg );
  audioLoader.load('audio/neutropoli/Milano metro bcg.mp3', function( buffer ) {
    backgroundSound.setBuffer( buffer );
    backgroundSound.setLoop( true );
    backgroundSound.setVolume( 0.125 );
    backgroundSound.play();
  });
  const listenerBcg2 = new THREE.AudioListener();
  camera.add(listenerBcg2);
  const audioLoader2 = new THREE.AudioLoader();
   // Selezioniamo i pulsanti
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
        soundEmme.pause();
        soundFotogramma.pause();
        soundChiha.pause();
        soundCiocca.pause();
        soundAccavalla.pause();
        soundPeriferia.pausa();
     } else {
        backgroundSound.play();
        soundEmme.play();
        soundFotogramma.play();
        soundChiha.play();
        soundCiocca.play();
        soundAccavalla.play();
        soundPeriferia.play();
     }
     isPlaying = !isPlaying;
  });
  // SPEAKER
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
      let speakerFotogramma = speakerEmme.clone();
      let speakerChiHa = speakerEmme.clone();
      let speakerCiocca = speakerEmme.clone();
      let speakerAccavalla = speakerEmme.clone();
      let speakerPeriferia = speakerEmme.clone();
      speakerFotogramma.position.set(0,-27,50);
      speakerChiHa.position.set(-18,-7.5,-110);
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

        if (soundEmme.isPlaying || soundFotogramma.isPlaying || soundChiha.isPlaying || soundCiocca.isPlaying || soundAccavalla.isPlaying) {
          backgroundSound.setVolume(0.03);
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

//   // ANIMATION

//   let positions = [
//   //START
//   {moveTime: 6, waitTime: 1, pos: {x: 0, y: 0, z: -150}},
//   // MOVE ////    
//   {moveTime: 6, waitTime: 1, pos: {x: -20, y: 0, z: -120}},    
//   {moveTime: 6, waitTime: 1, pos: {x: 0, y: -16, z: 46}}, 
//   {moveTime: 6, waitTime: 1, pos: {x: -22, y: 0, z: 46}}, 

//   // speakerFotogramma.position.set(0,-27,50);
//   // speakerChiHa.position.set(-18,-7.5,-110);
//   // speakerCiocca.position.set(-22,13,50);
//   // speakerAccavalla.position.set(22,-27,-50);
//   // speakerPeriferia.position.set(-22,13,-50);




  
//   // FINISH
//   {moveTime: 6, waitTime: 1, pos: {x: 0, y: 0, z: -150}},
//   ];

// // ROTATION

// // let rotations = [

// //   //START
// //   {rotTime: 1, rotWait: 10, rot: {x: 0, y: 0, z: 0}},

// //   // ROTATE////    
// //   /*1*/{rotTime: 6, rotWait: 0, rot: {x: 0, y: 0, z: 0}},
// //   /*2*/{rotTime: 6, rotWait: 0, rot: {x: 0, y: 0, z: 0}},

// //   ///*8*/{rotTime: 3, rotWait: 3, rot: {x: -Math.PI/2, y: -2*Math.PI, z: 0}}, //Mountain
// //   ///*9*/{rotTime: 3, rotWait: 3, rot: {x: 0, y: 2*Math.PI, z: -Math.PI/2}},// Ocean     

// //   // FINISH
// //   {rotTime: 6, rotWait: 0, rot: {x: 0, y: 0, z: 0}},
      
// // ];

// let tweenScene = function(index) {
//   if (index >= positions.length) index = 0;

//   gsap.to(camera.position, {
//     duration: positions[index].moveTime,
//     x: positions[index].pos.x,
//     y: positions[index].pos.y,
//     z: positions[index].pos.z,
//     onComplete: function() {
//       gsap.delayedCall(positions[index].waitTime, function() {
//         tweenScene(index + 1);
//       });
//     }    
//   });


//   // if (rotations[index]) {
//   //   gsap.to(scene.rotation, {
//   //     duration: rotations[index].rotTime,
//   //     x: rotations[index].rot.x,
//   //     y: rotations[index].rot.y,
//   //     z: rotations[index].rot.z,
//   //     onComplete: function() {
//   //       gsap.delayedCall(rotations[index].rotWait, function() {
//   //         tweenScene(index + 1);
//   //       });
//   //     }
//   //   });
//   // }
// };

// tweenScene(0);

// renderer.render(scene, camera);    

// // Funzione di animazione
// function animate() {
//   requestAnimationFrame(animate);

//   // Rotazione della camera sull'asse y
//   camera.rotation.y += 0.001;

//   renderer.render(scene, camera);
// }

// Avvio dell'animazione
animate();
};