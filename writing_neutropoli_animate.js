import * as THREE from 'three';
import {FirstPersonControls} from './three_class/FirstPersonControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';
//import { VRButton } from './three_class/VRButton.js';
export default function(){
  const clock = new THREE.Clock();
  // SCENE  
  const scene = new THREE.Scene();
  scene.position.set(0,0,0);  
  scene.rotation.set(0,0,0);

  scene.background = new THREE.Color( 0x008888 );  
  //scene.background = new THREE.Color( 0x000000 ); 
  scene.fog = new THREE.Fog(0x008888, 10, 60);
  //scene.fog = new THREE.Fog(0x000000, 10, 100);
  //CAMERA
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };  
  camera.position.set(0,2,-320); 
  //RENDERER
  const renderer = new THREE.WebGLRenderer({    
    alpha:true, 
    antialias:true}) ;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement ); 
  renderer.xr.enabled = true,  
  // RESIZE WINDOW
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  } );  
  const gridHelper = new THREE.GridHelper( 250,50 );  
  //scene.add(gridHelper);   
  //VRBUTTON
  // document.body.appendChild( VRButton.createButton( renderer ) );
  // renderer.setAnimationLoop( function () {
  //   renderer.render( scene, camera );    
  // } ); 
  // CAMERA  
  camera.lookAt(new THREE.Vector3( 0, player.height, 10));
  camera.lookAt( 0, 60, 1800); 
  // camera.setFocalLength ( 17 );
  camera.setFocalLength ( 10 );
  

  // CONTROLS
  const controls = new FirstPersonControls(camera, renderer.domElement);    
  controls.movementSpeed = 0.1;
  controls.lookSpeed = 0.00015;
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 0.6 )
  scene.add( ambiente);
  let int = 0.6;
  let dist = 10;
  let decay = 0.5;
  let ht = 1;
  let pointcolor = 0Xddddff;
  let pointcolor2 = 0Xddddff;
  let pointcolor3 = 0Xddddff;
  let pointcolor4 = 0Xddddff;
  let pointcolor5 = 0Xddddff;
  //POINT
  
  const pointLight = new THREE.PointLight( pointcolor, int, dist, decay); 
  pointLight.position.set( -3.3, ht, -287 );
  const pointLight2 = new THREE.PointLight( pointcolor2, int, dist, decay);    
  pointLight2.position.set( 2.05,ht,-210);
  const pointLight3 = new THREE.PointLight( pointcolor3, int, dist, decay); 
  pointLight3.position.set( 3,ht,-152 );
  const pointLight4 = new THREE.PointLight( pointcolor4, int, dist, decay); 
  pointLight4.position.set( 0, ht, 2 ); 
  const pointLight5 = new THREE.PointLight( pointcolor5, int, dist, decay); 
  pointLight5.position.set( -6, ht, 36 );
  const pointLight6 = new THREE.PointLight( pointcolor5, int, dist, decay); 
  pointLight5.position.set( 0, ht, 122 );  
  const helper1 = new THREE.PointLightHelper(pointLight);
  const helper2 = new THREE.PointLightHelper(pointLight2);
  const helper3 = new THREE.PointLightHelper(pointLight3);
  const helper4 = new THREE.PointLightHelper(pointLight4);  
  const helper5 = new THREE.PointLightHelper(pointLight5);
  const helper6 = new THREE.PointLightHelper(pointLight6); 
  // scene.add( helper1, helper2,helper3, helper4,helper5,helper6 );
  scene.add( pointLight, pointLight2,pointLight3,pointLight4, pointLight5,pointLight6  );
  pointLight.castShadow = true;
  //TEXTURES
  const loader = new THREE.TextureLoader();
  const texture1 = loader.load('./images/statics/Glitches/glitches_01 (6).jpg');// 6  
  const texture2 = loader.load('./images/statics/Glitches/glitches_01 (3).jpg'); // 3
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.wrapT = THREE.RepeatWrapping;
  texture2.repeat.set(2,2);
  let context;
  document.addEventListener('click', function () {
  if (!context) {
    context = new AudioContext();
  }
  });
  
  //AUDIO
  // POETRY 1
  var listenerEmme = new THREE.AudioListener();
  camera.add(listenerEmme);  
  var soundEmme = new THREE.Audio(listenerEmme); 
  var loaderEmme = new THREE.AudioLoader(); 
    loaderEmme.load('./audio/neutropoli/01_emme_uno.mp3', function(buffer) {
      soundEmme.setBuffer(buffer);
      soundEmme.setLoop(true);
      soundEmme.setVolume(1);
      //soundEmme.play();
    });
  // POETRY 2
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
  // POETRY 3
  var listenerAccavalla= new THREE.AudioListener();
  camera.add(listenerAccavalla);  
  var soundAccavalla = new THREE.Audio(listenerAccavalla);
  var loaderAccavalla = new THREE.AudioLoader();   
  loaderAccavalla.load('./audio/neutropoli/03_se_accavalla.mp3', function(buffer) {
    soundAccavalla.setBuffer(buffer);
    soundAccavalla.setLoop(true);
    soundAccavalla.setVolume(1);
      //soundAccavalla.play();
  });
  // POETRY 4
  var listenerCiocca = new THREE.AudioListener();
  camera.add(listenerCiocca);  
  var soundCiocca = new THREE.Audio(listenerCiocca);
  var loaderCiocca = new THREE.AudioLoader();    
  loaderCiocca.load('./audio/neutropoli/04_una_ciocca.mp3', function(buffer) {
   soundCiocca.setBuffer(buffer);
   soundCiocca.setLoop(true);
   soundCiocca.setVolume(1);
   //soundCiocca.play();
  }); 
  // POETRY 11
  var listenerPeriferia= new THREE.AudioListener();
  camera.add(listenerPeriferia);  
  var soundPeriferia = new THREE.Audio(listenerPeriferia);
  var loaderPeriferia = new THREE.AudioLoader();      
  loaderPeriferia.load('./audio/neutropoli/11_alla_periferia.mp3', function(buffer) {
    soundPeriferia.setBuffer(buffer);
    soundPeriferia.setLoop(true);
    soundPeriferia.setVolume(1);
    //soundPeriferia.play();
  });  

  // POETRY 
  var listenerFotogramma = new THREE.AudioListener();
  camera.add(listenerFotogramma);  
  var soundFotogramma = new THREE.Audio(listenerEmme);
  var loaderFotogramma = new THREE.AudioLoader();   
  loaderFotogramma.load('./audio/neutropoli/20_fotogramma.mp3', function(buffer) {
    soundFotogramma.setBuffer(buffer);
    soundFotogramma.setLoop(true);
    soundFotogramma.setVolume(1);
    //soundFotogramma.play();
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
  const backgroundSound2 = new THREE.Audio( listenerBcg2 );
  audioLoader2.load('audio/Attraction_3.mp3', function( buffer ) {
    backgroundSound2.setBuffer( buffer );
    backgroundSound2.setLoop( true );
    backgroundSound2.setVolume( 0.05 );
    backgroundSound2.play();
  });

    // SUBWAY GLB
    const subwayGLoader = new GLTFLoader();
    subwayGLoader.load(    
     './3d/subway/subway_9A.glb',
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

  // SPEAKER
  const speakerLoader = new GLTFLoader();
  speakerLoader.load(    
    './3d/humans/Low_person_3.glb',
     function (glt) {
       let hS = -7.5;
       const speakerEmme = glt.scene;
       speakerEmme.position.set(-3.3,hS,-285);
       speakerEmme.rotation.set( 0, Math.PI/1.5, 0 );      
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
      
      let speakerChiHa = speakerEmme.clone();
      let speakerAccavalla = speakerEmme.clone();
      let speakerCiocca = speakerEmme.clone();      
      let speakerPeriferia = speakerEmme.clone();
      let speakerFotogramma = speakerEmme.clone();

      speakerChiHa.position.set(2.05,hS,-208);
      speakerChiHa.rotation.set(0,1,0);

      speakerAccavalla.position.set(3,hS,-150);
      speakerAccavalla.rotation.set(0,Math.PI/1.6,0);

      speakerCiocca.position.set(0,hS,0);
      speakerCiocca.rotation.set(0,Math.PI,0);

      speakerPeriferia.position.set(-16,hS,38);   
      speakerPeriferia.rotation.set(0,0.8,0);

      speakerFotogramma.position.set(0,hS-0.75,124);
      speakerFotogramma.rotation.set(0,Math.PI/2,0);
      
      scene.add(speakerEmme,speakerChiHa,speakerAccavalla, speakerCiocca,speakerPeriferia, speakerFotogramma);

      // AUDIO DISTANCE  
      function animateScene(){
        requestAnimationFrame( animateScene );   
        controls.update(clock.getDelta());
        renderer.render( scene, camera );

        var distance1 = scene.position.distanceTo(speakerEmme.position); 
        var distance2 = scene.position.distanceTo(speakerChiHa.position);
        var distance3 = scene.position.distanceTo(speakerAccavalla.position);        
        var distance4 = scene.position.distanceTo(speakerCiocca.position);       
        var distance11 = scene.position.distanceTo(speakerPeriferia.position);
        var distance20 = scene.position.distanceTo(speakerFotogramma.position);
       

        var volume1 = 1 - Math.min(distance1 / 20, 1); 
        var volume2 = 1 - Math.min(distance2 / 20, 1); 
        var volume3 = 1 - Math.min(distance3 / 20, 1);      
        var volume4 = 1 - Math.min(distance4 / 20, 1);  
        var volume11= 1 - Math.min(distance11 / 20, 1);  
        var volume20 = 1 - Math.min(distance20 / 20, 1); 

        soundEmme.setVolume(volume1);        
        soundChiha.setVolume(volume2);
        soundAccavalla.setVolume(volume3);
        soundCiocca.setVolume(volume4);        
        soundPeriferia.setVolume(volume11);
        soundFotogramma.setVolume(volume20)

        if (!soundEmme.isPlaying && volume1 > 0) {
          soundEmme.play();
        } else if ( volume1 <= 0){          
          soundEmme.play();
          soundEmme.stop();                      
        }       
        if (!soundChiha.isPlaying && volume2 > 0) {
          soundChiha.play();
        } else if ( volume2 <= 0){
          soundChiha.play();
          soundChiha.stop(); 
        }
        if (!soundAccavalla.isPlaying && volume3 > 0) {
          soundAccavalla.play();;
        } else if ( volume3 <= 0){
          soundAccavalla.play();
          soundAccavalla.stop();
        }
        if (!soundCiocca.isPlaying && volume4 > 0) {
          soundCiocca.play();
        } else if ( volume4 <= 0){
          soundCiocca.play();
          soundCiocca.stop();
        }        
        if (!soundPeriferia.isPlaying && volume11 > 0) {
          soundPeriferia.play();;
        } else if ( volume11 <= 0){
          soundPeriferia.play();
          soundPeriferia.stop();
        }
        if (!soundFotogramma.isPlaying && volume20 > 0) {
          soundFotogramma.play(); 
        } else if ( volume20 <= 0){          
          soundFotogramma.play();
          soundFotogramma.stop();
        }        
        if (soundEmme.isPlaying || soundFotogramma.isPlaying || soundChiha.isPlaying || soundCiocca.isPlaying || soundAccavalla.isPlaying || soundPeriferia.isPlaying) {
          backgroundSound.setVolume(0.125);
          //backgroundSound2.setVolume(0.03);
        } else {
          backgroundSound.setVolume(0.125);
          //backgroundSound2.setVolume(0.125);
        }
        soundEmme.setVolume(volume1);        
        soundChiha.setVolume(volume2)
        soundAccavalla.setVolume(volume3)
        soundCiocca.setVolume(volume4)        
        soundPeriferia.setVolume(volume11)
        soundFotogramma.setVolume(volume20)
      };
      animateScene();
    }, 
    undefined, // funzione di progresso opzionale da passare al caricatore
    function (error) {
      console.error(error);      
    }
  ); 

  // CAMERA POSITION
  let positions = [ 
    // {moveTime: 0, waitTime: 50, pos: {x:0,y:2,z:98}},
    {moveTime: 260, waitTime: 0, pos: {x:0,y:2,z:120}},    
    {moveTime: 0, waitTime: 0, pos: {x:0,y:2,z: -320}},   
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
    {moveTime: 60, waitTime: 20, pos: {x:0,y:0, z:0}},
    {moveTime: 0, waitTime: 0, pos: {x:0,y:0, z:0}},
    {moveTime: 60, waitTime: 0, pos: {x:0,y:0, z:2*Math.PI}},
    {moveTime: 120, waitTime: 0, pos: {x:0,y:0, z:2*Math.PI}},
    
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
};