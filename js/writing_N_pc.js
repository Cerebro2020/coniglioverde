import * as THREE from 'three';
import { PointerLockControls } from '../three_class/PointerLockControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function(){
  const clock = new THREE.Clock();
  // === SCENE  ===
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x008888 );  
  scene.fog = new THREE.Fog(0x008888, 10, 100);
  // === CAMERA ===
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.set(20,4.5,-68);
  // === PLAYER ===
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
  //=== RENDERER ===
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
  // snipet
  document.body.addEventListener('click', () => {
  controls.lock();
});
  // === RESIZE WINDOW ===
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);  
  });
  // === CAMERA 2 === 
  camera.lookAt(new THREE.Vector3( 0, player.height, 10));
  camera.lookAt( 0, 60, 800); 
  camera.setFocalLength ( 25 );
  // === CONTROLS ===
  const controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  const move = { forward: false, backward: false, left: false, right: false };
  let velocity = new THREE.Vector3();
  let direction = new THREE.Vector3();

  //MOVEMENTS
  document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'Space': move.up = true; break;
    case 'ShiftLeft': move.down = true; break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
    case 'Space': move.up = false; break;
    case 'ShiftLeft': move.down = false; break;
  }
});
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 0.2 )
  scene.add( ambiente);
  // === POINTLIGHT === 
  let pointcolor = 0xffffff;
  let int = 0.8;
  let dist = 8; 
  // EMME
  const point1 = new THREE.SpotLight(pointcolor, int, dist);
  point1.castShadow = true;
  point1.position.set(-2,3.5,-53)
  scene.add(point1);
  // CHI HA
  const point2 = new THREE.SpotLight(pointcolor, int, dist);
  point2.castShadow = true;  
  point2.position.set(-21,3,-93);
  scene.add(point2);
  // ACCAVALLA
  const point3 = new THREE.SpotLight(pointcolor, int, dist);
  point3.castShadow = true;  
  point3.position.set(-22,24,47.5);
  scene.add(point3);
  // CIOCCA
  const point4 = new THREE.SpotLight(pointcolor, int, dist);
  point4.castShadow = true;
  point4.position.set(22,-16,-54);
  scene.add(point4);
  // Helper 
  const helper1 = new THREE.PointLightHelper(point1);
  const helper2 = new THREE.PointLightHelper(point2);
  const helper3 = new THREE.PointLightHelper(point3);
  const helper4 = new THREE.PointLightHelper(point4);
  // scene.add(helper1, helper2, helper3, helper4);

  //== VIDEO TEXTURE ==//
  const video = document.createElement('video');
  video.src = 'video/video_textures/neutropoli.mp4';
  // video.src = 'video/video_textures/neutropoli_2.mp4';
  // video.src = 'video/video_textures/water_loop.mp4';
  video.muted = true;        
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.style.display = 'none';
  document.body.appendChild(video);

  // avvia il caricamento
  video.load();

  // necessario per sbloccare l’autoplay
  video.play().catch(() => {
      console.warn('Autoplay bloccato finché non avviene un gesto dell’utente.');
  });

  // VideoTexture
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.wrapS = THREE.ClampToEdgeWrapping;
  videoTexture.wrapT = THREE.ClampToEdgeWrapping;

  // avvia il video
  video.load();
  video.play().catch(() => {
    // gestione opzionale se il browser blocca l'autoplay
    console.warn('Autoplay bloccato: avvia il video dopo un gesto dell’utente.');
  });

  // === TEXTURES ===
  const loader = new THREE.TextureLoader();
  const texture1 = loader.load('./images/textures/glitches_01 (6).jpg'); 
  const texture2 = loader.load('./images/textures/glitches_01 (3).jpg');
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.wrapT = THREE.RepeatWrapping;
  texture2.repeat.set(2,2);
  const texture3 = loader.load('./images/textures/Glitches_01_bn.jpg');
  texture3.wrapS = THREE.RepeatWrapping;
  texture3.wrapT = THREE.RepeatWrapping;
  texture3.repeat.set(2,2);  
  //=== AUDIO ===
  // POETRY 1 - emmeuno
  var listenerEmme = new THREE.AudioListener();
  camera.add(listenerEmme);  
  var soundEmme = new THREE.Audio(listenerEmme); 
  var loaderEmme = new THREE.AudioLoader(); 
  loaderEmme.load('./audio/neutropoli/01_emmeuno.m4a', function(buffer) {
    soundEmme.setBuffer(buffer);
    soundEmme.setLoop(true);
    soundEmme.setVolume(1);
    //soundEmme.play();
  });
  // POETRY 2 - chiha
  var listenerChiaha = new THREE.AudioListener();
  camera.add(listenerChiaha);  
  var soundChiha = new THREE.Audio(listenerChiaha);
  var loaderChiha = new THREE.AudioLoader();    
  loaderChiha.load('./audio/neutropoli/02_chiha.m4a', function(buffer) {
    soundChiha.setBuffer(buffer);
    soundChiha.setLoop(true);
    soundChiha.setVolume(1);
  //soundChiha.play();
  });  
  // POETRY 3 - seaccavalla
  var listenerAccavalla= new THREE.AudioListener();
  camera.add(listenerAccavalla);  
  var soundAccavalla = new THREE.Audio(listenerAccavalla);
  var loaderAccavalla = new THREE.AudioLoader();   
  loaderAccavalla.load('./audio/neutropoli/03_seaccavalla.m4a', function(buffer) {
    soundAccavalla.setBuffer(buffer);
    soundAccavalla.setLoop(true);
    soundAccavalla.setVolume(0.5);
    //soundAccavalla.play();
  });
  // POETRY 4 - ciocca
  var listenerCiocca = new THREE.AudioListener();
  camera.add(listenerCiocca);  
  var soundCiocca = new THREE.Audio(listenerCiocca);
  var loaderCiocca = new THREE.AudioLoader();    
  loaderCiocca.load('./audio/neutropoli/04_ciocca.m4a', function(buffer) {
    soundCiocca.setBuffer(buffer);
    soundCiocca.setLoop(true);
    soundCiocca.setVolume(0.5);
    //soundCiocca.play();
  });
  // BACKGROUND 1
  const listenerBcg = new THREE.AudioListener();
  camera.add(listenerBcg);
  const audioLoader = new THREE.AudioLoader();
  const backgroundSound = new THREE.Audio( listenerBcg );
  audioLoader.load('audio/neutropoli/Milano_Background_metro.m4a', function( buffer ) {
    backgroundSound.setBuffer( buffer );
    backgroundSound.setLoop( true );
    backgroundSound.setVolume(1);
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
    backgroundSound2.setVolume(1);
    backgroundSound2.play();
  });

 
  // SPEAKER - GLTF   
  const speakerLoader = new GLTFLoader();
  speakerLoader.load(    
    './3d/humans/Low_person_3.glb',
    function (glt) {
      const speakerEmme = glt.scene;
      speakerEmme.position.set(-2,-7.5,-50);
      speakerEmme.rotation.set( 0, Math.PI/2.5, 0 );      
      speakerEmme.scale.set( 12, 12, 12 );        
      speakerEmme.traverse(function (node) {
        if (node.isMesh) { 
          const materialSGL = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, 
            emissiveIntensity: 1,
            map: texture2,
            // map: videoTexture,  
            roughness: 0,
            roughnessMap: texture3,
            metalness: 0,
            metalnessMap: texture3,
            clearcoat: 0.1,
            clearcoatNormalMap: texture3,
            bumpMap: texture3,
            // bumpMap: videoTexture,
            bumpScale: 0.1, 
          });  
          node.material = materialSGL;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });          
      speakerEmme.castShadow = true;
      speakerEmme.receiveShadow = true;
      // chi ha
      let speakerChiHa = speakerEmme.clone();
       // accavalla
      let speakerAccavalla = speakerEmme.clone();
      // ciocca
      let speakerCiocca = speakerEmme.clone();    
      speakerChiHa.position.set(-21,-7.5,-90);
      speakerAccavalla.position.set(22,-27,-50);
      speakerCiocca.position.set(-22,13,50);
      scene.add(speakerEmme,speakerChiHa,speakerAccavalla,speakerCiocca);
      // AUDIO DISTANCE  
      function animateScene(){
        requestAnimationFrame( animateScene );

        ////
        // DELTA AGGIORNATO   
        const delta = clock.getDelta();
        velocity.set(0, 0, 0);

        if (move.forward) velocity.z += player.speed;
        if (move.backward) velocity.z -= player.speed;
        if (move.left) velocity.x -= player.speed;
        if (move.right) velocity.x += player.speed;
        if (move.up) velocity.y += player.speed;
        if (move.down) velocity.y -= player.speed;

        

        direction.copy(velocity).normalize();
        controls.moveRight(direction.x * delta * 4.5);
        controls.moveForward(direction.z * delta * 4.5);
        controls.getObject().position.y += velocity.y * delta * 7;
        renderer.render( scene, camera );
        // VAR DISTANCE //
        var distance = camera.position.distanceTo(speakerEmme.position);
        var distance2 = camera.position.distanceTo(speakerChiHa.position);
        var distance3 = camera.position.distanceTo(speakerAccavalla.position);
        var distance4 = camera.position.distanceTo(speakerCiocca.position);

        var volume = 1 - Math.min(distance / 20, 1); 
        var volume2 = 1 - Math.min(distance2 / 20, 1); 
        var volume3 = 1 - Math.min(distance3 / 20, 1);      
        var volume4 = 1 - Math.min(distance4 / 20, 1);  

        soundEmme.setVolume(volume);        
        soundChiha.setVolume(volume2);
        soundCiocca.setVolume(volume3);
        soundAccavalla.setVolume(volume4);

        if (!soundEmme.isPlaying && volume > 0) {
          soundEmme.play();
        } else if ( volume <= 0){          
          soundEmme.play();
          soundEmme.stop();                      
        }
       
        if (!soundChiha.isPlaying && volume2 > 0) {
          soundChiha.play();
        } else if ( volume2 <= 0){
          soundChiha.play();
          soundChiha.stop(); 
        }
        
        if (!soundCiocca.isPlaying && volume3 > 0) {
          soundCiocca.play();
        } else if ( volume3 <= 0){
          soundCiocca.play();
          soundCiocca.stop();
        }
        
        if (!soundAccavalla.isPlaying && volume4 > 0) {
          soundAccavalla.play();;
        } else if ( volume4 <= 0){
          soundAccavalla.play();
          soundAccavalla.stop();
        }    

        if (soundEmme.isPlaying || soundChiha.isPlaying || soundAccavalla.isPlaying || soundCiocca.isPlaying
        ) {
          backgroundSound.setVolume(0.05);
          backgroundSound2.setVolume(0.07);
        } else {
          backgroundSound.setVolume(0.1);
          backgroundSound2.setVolume(0.07);
        }        
        soundEmme.setVolume(volume)
        soundChiha.setVolume(volume2)
        soundCiocca.setVolume(volume3)
        soundAccavalla.setVolume(volume4)
      };
      animateScene();
    }, 
    undefined, 
    function (error) {
      console.error(error);      
    }
  );
  // === OBJECTS ===
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
    undefined, 
    function (error) {
    console.error(error);      
    } 
  );
    
  animate();
  if (typeof controls !== 'undefined') controls.enabled = false;
};