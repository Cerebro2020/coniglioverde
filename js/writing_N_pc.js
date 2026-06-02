import * as THREE from 'three';
import { PointerLockControls } from '../three_class/PointerLockControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function(){
  const clock = new THREE.Clock();

  // === SCENE ===
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x008888);  
  scene.fog = new THREE.Fog(0x008888, 10, 100);

  // === CAMERA ===
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(20, 4.5, -68);

  // === PLAYER ===
  let player = {
    height: 1.8,
    speed: 0.2,
    turnSpeed: Math.PI * 0.02
  };

  // === RENDERER ===
  const renderer = new THREE.WebGLRenderer({    
    alpha: true, 
    antialias: true
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  document.body.appendChild(renderer.domElement);

  // === CAMERA 2 ===
  camera.lookAt(0, 60, 800); 
  camera.setFocalLength(25);

  // === CONTROLS ===
  const controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  document.body.addEventListener('click', () => {
    controls.lock();
  });

  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  };

  let velocity = new THREE.Vector3();
  let direction = new THREE.Vector3();

  // === MOVEMENTS ===
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

  // === RESIZE WINDOW ===
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);  
  });

  // === LIGHTS ===
  const ambiente = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambiente);

  let pointcolor = 0xffffff;
  let int = 0.8;
  let dist = 8; 

  // EMME
  const point1 = new THREE.PointLight(pointcolor, int, dist);
  point1.castShadow = true;
  point1.position.set(-2, 3.5, -53);
  scene.add(point1);

  // CHI HA
  const point2 = new THREE.PointLight(pointcolor, int, dist);
  point2.castShadow = true;  
  point2.position.set(-21, 3, -93);
  scene.add(point2);

  // ACCAVALLA
  const point3 = new THREE.PointLight(pointcolor, int, dist);
  point3.castShadow = true;  
  point3.position.set(-22, 26, 47);
  scene.add(point3);

  // CIOCCA
  const point4 = new THREE.PointLight(pointcolor, int, dist);
  point4.castShadow = true;
  point4.position.set(22, -16, -54);
  scene.add(point4);

  // Helper
  const helper1 = new THREE.PointLightHelper(point1);
  const helper2 = new THREE.PointLightHelper(point2);
  const helper3 = new THREE.PointLightHelper(point3);
  const helper4 = new THREE.PointLightHelper(point4);
  // scene.add(helper1, helper2, helper3, helper4);

  // === VIDEO TEXTURE ===
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

  video.load();
  video.play().catch(() => {
    console.warn('Autoplay bloccato finché non avviene un gesto dell’utente.');
  });

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.wrapS = THREE.ClampToEdgeWrapping;
  videoTexture.wrapT = THREE.ClampToEdgeWrapping;

  // === TEXTURES ===
  const loader = new THREE.TextureLoader();

  const texture1 = loader.load('./images/textures/glitches_01 (6).jpg'); 

  const texture2 = loader.load('./images/textures/glitches_01 (3).jpg');
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.wrapT = THREE.RepeatWrapping;
  texture2.repeat.set(2, 2);

  const texture3 = loader.load('./images/textures/Glitches_01_bn.jpg');
  texture3.wrapS = THREE.RepeatWrapping;
  texture3.wrapT = THREE.RepeatWrapping;
  texture3.repeat.set(2, 2);

  // === POLVERE / FOSCHIA VOLUMETRICA ===
  const dustGeometry = new THREE.BufferGeometry();
  const dustCount = 40000;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 300;
    dustPositions[i * 3 + 1] = Math.random() * 45 - 40;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 600;
  }

  dustGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(dustPositions, 3)
  );

  const dustMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.22,
    depthWrite: false
  });

  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);

  // === AUDIO ===
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const loaderEmme = new THREE.AudioLoader();
  const soundEmme = new THREE.Audio(listener);

  loaderEmme.load('./audio/neutropoli/01_emmeuno.m4a', function(buffer) {
    soundEmme.setBuffer(buffer);
    soundEmme.setLoop(true);
    soundEmme.setVolume(0);
  });

  const loaderChiha = new THREE.AudioLoader();
  const soundChiha = new THREE.Audio(listener);

  loaderChiha.load('./audio/neutropoli/02_chiha.m4a', function(buffer) {
    soundChiha.setBuffer(buffer);
    soundChiha.setLoop(true);
    soundChiha.setVolume(0);
  });  

  const loaderAccavalla = new THREE.AudioLoader();
  const soundAccavalla = new THREE.Audio(listener);

  loaderAccavalla.load('./audio/neutropoli/03_seaccavalla.m4a', function(buffer) {
    soundAccavalla.setBuffer(buffer);
    soundAccavalla.setLoop(true);
    soundAccavalla.setVolume(0);
  });

  const loaderCiocca = new THREE.AudioLoader();
  const soundCiocca = new THREE.Audio(listener);

  loaderCiocca.load('./audio/neutropoli/04_ciocca.m4a', function(buffer) {
    soundCiocca.setBuffer(buffer);
    soundCiocca.setLoop(true);
    soundCiocca.setVolume(0);
  });

  const audioLoader = new THREE.AudioLoader();
  const backgroundSound = new THREE.Audio(listener);

  audioLoader.load('audio/neutropoli/Milano_Background_metro.m4a', function(buffer) {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.01);
    backgroundSound.play();
  });

  const audioLoader2 = new THREE.AudioLoader();
  const backgroundSound2 = new THREE.Audio(listener);

  audioLoader2.load('audio/neutropoli/attraction.m4a', function(buffer) {
    backgroundSound2.setBuffer(buffer);
    backgroundSound2.setLoop(true);
    backgroundSound2.setVolume(0);
    backgroundSound2.play();
  });

  function updateSoundPlayback(sound, volume) {
    if (volume > 0.01) {
      if (!sound.isPlaying && sound.buffer) {
        sound.play();
      }
    } else {
      if (sound.isPlaying) {
        sound.stop();
      }
    }
  }

  let smoothVolume1 = 0;
  let smoothVolume2 = 0;
  let smoothVolume3 = 0;
  let smoothVolume4 = 0;

  // === SPEAKER - GLTF ===
  const speakerLoader = new GLTFLoader();

  speakerLoader.load(    
    './3d/humans/Low_person_3.glb',
    function (glt) {
      const speakerEmme = glt.scene;

      speakerEmme.position.set(-2, -7.5, -50);
      speakerEmme.rotation.set(0, Math.PI / 2.5, 0);      
      speakerEmme.scale.set(12, 12, 12);        

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

      // CHI HA
      let speakerChiHa = speakerEmme.clone();

      // ACCAVALLA
      let speakerAccavalla = speakerEmme.clone();

      // CIOCCA
      let speakerCiocca = speakerEmme.clone();    

      speakerChiHa.position.set(-21, -7.5, -90);
      speakerAccavalla.position.set(22, -27, -50);
      speakerCiocca.position.set(-22, 13, 50);

      scene.add(
        speakerEmme,
        speakerChiHa,
        speakerAccavalla,
        speakerCiocca
      );

      // Posizioni base per respirazione / oscillazione
      const baseYEmme = -7.5;
      const baseYChiHa = -7.5;
      const baseYAccavalla = -27;
      const baseYCiocca = 13;

      // === AUDIO DISTANCE + ANIMATION ===
      function animateScene(){
        requestAnimationFrame(animateScene);

        const delta = clock.getDelta();
        const elapsed = clock.elapsedTime;

        // Camera fantasmatica: nessuna collisione.
        velocity.set(0, 0, 0);

        if (move.forward) velocity.z += player.speed;
        if (move.backward) velocity.z -= player.speed;
        if (move.left) velocity.x -= player.speed;
        if (move.right) velocity.x += player.speed;
        if (move.up) velocity.y += player.speed;
        if (move.down) velocity.y -= player.speed;        

        if (velocity.lengthSq() > 0) {
          direction.copy(velocity).normalize();

          controls.moveRight(direction.x * delta * 7);
          controls.moveForward(direction.z * delta * 7);
          controls.getObject().position.y += velocity.y * delta * 40;
        }

        // Respirazione / oscillazione minima dei personaggi
        speakerEmme.position.y = baseYEmme + Math.sin(elapsed * 1.2) * 0.08;
        speakerChiHa.position.y = baseYChiHa + Math.sin(elapsed * 1.1 + 1.5) * 0.08;
        speakerAccavalla.position.y = baseYAccavalla + Math.sin(elapsed * 1.3 + 2.5) * 0.08;
        speakerCiocca.position.y = baseYCiocca + Math.sin(elapsed * 1.15 + 3.5) * 0.08;

        speakerEmme.rotation.y = Math.PI / 2.5 + Math.sin(elapsed * 0.5) * 0.015;
        speakerChiHa.rotation.y = Math.PI / 2.5 + Math.sin(elapsed * 0.45 + 1.2) * 0.015;
        speakerAccavalla.rotation.y = Math.PI / 2.5 + Math.sin(elapsed * 0.55 + 2.1) * 0.015;
        speakerCiocca.rotation.y = Math.PI / 2.5 + Math.sin(elapsed * 0.48 + 3.2) * 0.015;

        // Movimento lento della polvere
        dust.rotation.y = elapsed * 0.015;
        dust.rotation.x = Math.sin(elapsed * 0.1) * 0.02;

        // Distanze audio
        var distance = camera.position.distanceTo(speakerEmme.position);
        var distance2 = camera.position.distanceTo(speakerChiHa.position);
        var distance3 = camera.position.distanceTo(speakerAccavalla.position);
        var distance4 = camera.position.distanceTo(speakerCiocca.position);

        var volume = 1 - Math.min(distance / 20, 1); 
        var volume2 = 1 - Math.min(distance2 / 20, 1); 
        var volume3 = 1 - Math.min(distance3 / 20, 1);      
        var volume4 = 1 - Math.min(distance4 / 20, 1);  

        // Transizioni audio morbide
        smoothVolume1 = THREE.MathUtils.lerp(smoothVolume1, volume, 0.04);
        smoothVolume2 = THREE.MathUtils.lerp(smoothVolume2, volume2, 0.04);
        smoothVolume3 = THREE.MathUtils.lerp(smoothVolume3, volume3, 0.04);
        smoothVolume4 = THREE.MathUtils.lerp(smoothVolume4, volume4, 0.04);

        soundEmme.setVolume(smoothVolume1);        
        soundChiha.setVolume(smoothVolume2);
        soundCiocca.setVolume(smoothVolume3);
        soundAccavalla.setVolume(smoothVolume4);

        updateSoundPlayback(soundEmme, smoothVolume1);
        updateSoundPlayback(soundChiha, smoothVolume2);
        updateSoundPlayback(soundCiocca, smoothVolume3);
        updateSoundPlayback(soundAccavalla, smoothVolume4);

        if (
          smoothVolume1 > 0.01 ||
          smoothVolume2 > 0.01 ||
          smoothVolume3 > 0.01 ||
          smoothVolume4 > 0.01
        ) {
          backgroundSound.setVolume(0.05);
          backgroundSound2.setVolume(0);
        } else {
          backgroundSound.setVolume(0.01);
          backgroundSound2.setVolume(0);
        }

        renderer.render(scene, camera);
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

      subwayG.position.set(0, 0, 0);
      subwayG.rotation.set(0, -Math.PI / 2, 0);      
      subwayG.scale.set(3, 3, 3);        

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

      sittingG.position.set(0, 0, 0);
      sittingG.rotation.set(0, -Math.PI / 2, 0);      
      sittingG.scale.set(3, 3, 3);        

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
};