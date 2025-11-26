import * as THREE from 'three';
import {FirstPersonControls} from '../three_class/FirstPersonControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function(){

  let autoSequenceActive = true;
  let jumpRequested = false;
  let jumpStarted = false;
  let autoMode = true;

  let cameraIsMoving = false;
  const clock = new THREE.Clock();
  // window.resetCamera = resetCamera;
  // === SCENE  ===
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x008888 );  
  scene.fog = new THREE.Fog(0x008888, 10, 100);
  // === CAMERA ===
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.set(30,4.5,-150);
  
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
  const controls = new FirstPersonControls(camera, renderer.domElement);   
  controls.movementSpeed = 0.001;
  controls.lookSpeed = 0.0001;
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 0.2 )
  scene.add( ambiente);
  // === POINTLIGHT === 
  let pointcolor = 0xffffff;
  let int = 0.8;
  let dist = 8; 
  // EMME
  const point1 = new THREE.PointLight(pointcolor, int, dist);
  point1.castShadow = true;
  point1.position.set(-2,3.5,-53)
  scene.add(point1);
  // CHI HA
  const point2 = new THREE.PointLight(pointcolor, int, dist);
  point2.castShadow = true;  
  point2.position.set(-21,3,-93);
  scene.add(point2);
  // ACCAVALLA
  const point3 = new THREE.PointLight(pointcolor, int, dist);
  point3.castShadow = true;  
  point3.position.set(-22,26,47);
  scene.add(point3);
  // CIOCCA
  const point4 = new THREE.PointLight(pointcolor, int, dist);
  point4.castShadow = true;
  point4.position.set(22,-16,-54);
  scene.add(point4);
  // Helper 
  const helper1 = new THREE.PointLightHelper(point1);
  const helper2 = new THREE.PointLightHelper(point2);
  const helper3 = new THREE.PointLightHelper(point3);
  const helper4 = new THREE.PointLightHelper(point4);
  // scene.add(helper1, helper2, helper3, helper4);
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
    soundEmme.setLoop(false);
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
    soundChiha.setLoop(false);
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
    soundAccavalla.setLoop(false);
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
    soundCiocca.setLoop(false);
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

  // === PULSANTI ===

  // Crea bottone modalità se non esiste già
let btnModeContainer = document.createElement('div');
btnModeContainer.id = 'btn-mode';

let toggleModeButton = document.createElement('button');
toggleModeButton.id = 'toggle-mode';

const modeIcon = document.createElement('img');
modeIcon.id = 'mode-icon';
modeIcon.src = autoMode ? 'images/icons/moviecam.png' : 'images/icons/book.png';
modeIcon.alt = autoMode ? 'Modalità automatica' : 'Modalità manuale';
modeIcon.style.width = '16px';
modeIcon.style.height = '16px';

toggleModeButton.appendChild(modeIcon);
btnModeContainer.appendChild(toggleModeButton);

// Inserisci nel container dei controlli
document.getElementById('cam-nav').appendChild(btnModeContainer);

// Listener toggle
toggleModeButton.addEventListener('click', () => {
  autoMode = !autoMode;
  modeIcon.src = autoMode ? 'images/icons/moviecam.png' : 'images/icons/book.png';
  modeIcon.alt = autoMode ? 'Modalità automatica' : 'Modalità manuale';
});

  // Selezioniamo i pulsanti //
  // let cameraButton = document.querySelector('#btn-camera button');   
  // cameraButton.addEventListener('click', function() {
  //   resetCamera();
  // });  
  // function resetCamera() {
  //   camera.position.set(  30, 4.5, -68 ); 
  //   camera.rotation.set( 1, 0, 0 );
  //   camera.lookAt(new THREE.Vector3( 0, player.height, 0)); 
  //   controls.listenToKeyEvents( window );
  //   controls.minDistance =  5;    
  //   controls.maxDistance = 1400;
  //   controls.maxPolarAngle = 1.5; 
  // }
  let audioButton = document.querySelector('#btn-audio button');
  let isPlaying = true;
  audioButton.addEventListener('click', function() {
    if (isPlaying) {
      backgroundSound.pause();
      backgroundSound2.pause();
      soundEmme.pause();      
      soundChiha.pause();
      soundCiocca.pause();
      soundAccavalla.pause();
      // soundFotogramma.pause();
      // soundPeriferia.pause();
    } else {
      backgroundSound.play();
      backgroundSound2.play();
      soundEmme.play();      
      soundChiha.play();
      soundAccavalla.play();
      soundCiocca.play();      
      // soundFotogramma.play();
      // soundPeriferia.play();
    }
    isPlaying = !isPlaying;
  });
    // const modeIcon = document.getElementById('mode-icon');

    // toggleModeButton.addEventListener('click', () => {
    //   autoMode = !autoMode;
    //   modeIcon.src = autoMode ? 'images/icons/moviecam.png' : 'images/icons/book.png';
    //   modeIcon.alt = autoMode ? 'modalità automatica' : 'modalità manuale';
    // });
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
            roughness: 0,
            roughnessMap: texture3,
            metalness: 0,
            metalnessMap: texture3,
            clearcoat: 0.1,
            clearcoatNormalMap: texture3,
            bumpMap: texture3, 
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
      function animateScene() {
  requestAnimationFrame(animateScene);
  controls.update(clock.getDelta());
  renderer.render(scene, camera);

  // Blocca logica audio se la camera è in movimento
  if (!cameraIsMoving) {
    const distance = camera.position.distanceTo(speakerEmme.position);
    const distance2 = camera.position.distanceTo(speakerChiHa.position);
    const distance3 = camera.position.distanceTo(speakerAccavalla.position);
    const distance4 = camera.position.distanceTo(speakerCiocca.position);

    const volume = 1 - Math.min(distance / 20, 1);
    const volume2 = 1 - Math.min(distance2 / 20, 1);
    const volume3 = 1 - Math.min(distance3 / 20, 1);
    const volume4 = 1 - Math.min(distance4 / 20, 1);

    soundEmme.setVolume(volume);
    soundChiha.setVolume(volume2);
    soundCiocca.setVolume(volume3);
    soundAccavalla.setVolume(volume4);

    if (volume > 0 && !soundEmme.isPlaying) soundEmme.play();
    else if (volume <= 0 && soundEmme.isPlaying) soundEmme.stop();

    if (volume2 > 0 && !soundChiha.isPlaying) soundChiha.play();
    else if (volume2 <= 0 && soundChiha.isPlaying) soundChiha.stop();

    if (volume3 > 0 && !soundCiocca.isPlaying) soundCiocca.play();
    else if (volume3 <= 0 && soundCiocca.isPlaying) soundCiocca.stop();

    if (volume4 > 0 && !soundAccavalla.isPlaying) soundAccavalla.play();
    else if (volume4 <= 0 && soundAccavalla.isPlaying) soundAccavalla.stop();
  }

  // Gestione volumi di sottofondo
  if (
      soundEmme.isPlaying ||
      soundChiha.isPlaying ||
      soundAccavalla.isPlaying ||
      soundCiocca.isPlaying
    ) {
      backgroundSound.setVolume(0.05);
      backgroundSound2.setVolume(0.07);
    } else {
      backgroundSound.setVolume(0.1);
      backgroundSound2.setVolume(0.07);
      }
    }      
            
  
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

  const SittingLoader = new GLTFLoader();
  SittingLoader.load(    
   './3d/subway/sitting.glb',
    function (glt) {
      const sittingG = glt.scene;
      sittingG.position.set( 0, 0, 0 );
      sittingG.rotation.set( 0, -Math.PI/2, 0 );      
      sittingG.scale.set( 3, 3, 3 );        
      sittingG.traverse(function (node) {
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
      scene.add(sittingG);        
      sittingG.castShadow = true; 
      sittingG.receiveShadow = true; 
    }, 
    undefined, 
    function (error) {
    console.error(error);      
    } 
  );

  const Sitting2Loader = new GLTFLoader();
      Sitting2Loader.load(    
       './3d/subway/sitting_2.glb',
        function (glt) {
          const sitting2G = glt.scene;
          sitting2G.position.set( 0, 0, 0 );
          sitting2G.rotation.set( 0, -Math.PI/2, 0 );      
          sitting2G.scale.set( 3, 3, 3 );        
          sitting2G.traverse(function (node) {
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
          scene.add(sitting2G);        
          sitting2G.castShadow = true; 
          sitting2G.receiveShadow = true; 
        }, 
        undefined, 
        function (error) {
        console.error(error);      
        } 
      );

    // == TEWEEN ==
    let currentTween = null;

    document.querySelectorAll('[data-goto]').forEach(button => {
  button.addEventListener('click', (e) => {
    const targetIndex = parseInt(button.getAttribute('data-goto'), 10);

    if (!isNaN(targetIndex)) {
      if (currentTween) {
        currentTween.kill();
        currentTween = null;
      }

      autoSequenceActive = false;
      jumpRequested = true;
      jumpStarted = true;


      tweenScene(targetIndex);
    }
  });
});


  // CAMERA POSITION //////////
  let positions = [ 
     
    {moveTime:0,waitTime:0,
      pos:{x:30,y:4.5,z:-150}
    },/*start*/
    {moveTime:40,waitTime:35,
      pos:{x:-2,y:1.5,z:-58}
    },/*Emme1*/
    {moveTime:6,waitTime:79,
      pos: {x:-22,y:1,z:-98}
    },/*ChiHa*/
    {moveTime:16,waitTime:43,
      pos: {x:-22,y:22,z:40}
    },/*Acca*/
    {moveTime:10,waitTime:24, 
      pos: {x:22,y:-18,z:-62}
    },/*Cioc*/
  ]; 

  
  let tweenScene = function(index) {
    // let jumpStarted = false;
    if (index >= positions.length) index = 1;
    if (currentTween) {
      currentTween.kill();
      currentTween = null;
    }

    cameraIsMoving = true;
    currentTween = gsap.to(camera.position, {
    duration: positions[index].moveTime,
    x: positions[index].pos.x,
    y: positions[index].pos.y,
    z: positions[index].pos.z,

    onComplete: function () {
      currentTween = null;
      cameraIsMoving = false;

      // Ferma eventuali audio attivi
      // Ferma solo gli audio NON necessari
      if (index !== 1 && soundEmme.isPlaying) soundEmme.stop();
      if (index !== 2 && soundChiha.isPlaying) soundChiha.stop();
      if (index !== 3 && soundAccavalla.isPlaying) soundAccavalla.stop();
      if (index !== 4 && soundCiocca.isPlaying) soundCiocca.stop();


      // Riproduci l’audio corretto con un piccolo ritardo
      gsap.delayedCall(0.5, function () {
        if (index === 1 && !soundEmme.isPlaying) soundEmme.play();
        if (index === 2 && !soundChiha.isPlaying) soundChiha.play();
        if (index === 3 && !soundAccavalla.isPlaying) soundAccavalla.play();
        if (index === 4 && !soundCiocca.isPlaying) soundCiocca.play();
      });

      // Procedi alla prossima scena dopo il tempo di attesa
      const proceedToNextScene = () => {
  if (jumpStarted) {
    autoSequenceActive = true;
    jumpStarted = false;
  }

  if (autoSequenceActive && autoMode) {
  if (index < positions.length - 1) {
    // Avanza normalmente alla prossima scena
    tweenScene(index + 1);
  } else {
    // Ultima scena: torna alla prima posizione con movimento
    gsap.to(camera.position, {
      duration: 4,
      x: positions[0].pos.x,
      y: positions[0].pos.y,
      z: positions[0].pos.z,
      onComplete: () => {
        tweenScene(0); // riparte da capo!
      }
    });
  }
}








};

const setAudioAndProceed = (audio) => {
  if (!audio.isPlaying) audio.play();
  audio.source.onended = () => {
    proceedToNextScene();
  };
};

// Avvia audio corretto
gsap.delayedCall(0.5, function () {
  if (index === 1) setAudioAndProceed(soundEmme);
  else if (index === 2) setAudioAndProceed(soundChiha);
  else if (index === 3) setAudioAndProceed(soundAccavalla);
  else if (index === 4) setAudioAndProceed(soundCiocca);
});

// Prendi la durata dell'audio corrente, o fallback a 10 sec
const audioDurations = {
  1: soundEmme.buffer ? soundEmme.buffer.duration : 10,
  2: soundChiha.buffer ? soundChiha.buffer.duration : 10,
  3: soundAccavalla.buffer ? soundAccavalla.buffer.duration : 10,
  4: soundCiocca.buffer ? soundCiocca.buffer.duration : 10
};

const delayTime = audioDurations[index] || 60;

if (autoMode) {
  gsap.delayedCall(delayTime, proceedToNextScene);
}

    }
    });
  };
  // 2. Movimento iniziale verso la prima posizione
  camera.position.set(0, 0, -150);
gsap.to(camera.position, {
  duration: 4,
  x: positions[0].pos.x,
  y: positions[0].pos.y,
  z: positions[0].pos.z,
  onComplete: () => {
    tweenScene(1); 
  }
});
};