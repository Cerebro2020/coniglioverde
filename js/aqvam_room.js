import * as THREE from 'three';
import { PointerLockControls } from '../three_class/PointerLockControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function(){ 
    
  const clock = new THREE.Clock();
    // === SCENE  ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x008888);
    scene.background = new THREE.Color( 0x000000);   
    scene.fog = new THREE.Fog(0x008888, 10, 100);
    scene.fog = new THREE.Fog(0x000000, 10, 100);
     // === PLAYER ===
    let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
    // camera.position.set(18,player.height+5,30);
    camera.position.set(0,player.height,-18);
   
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
      renderer.setSize( width, height );
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    } );
    // === CAMERA 2 === 
    camera.lookAt(new THREE.Vector3( 0, player.height, 10));
    camera.lookAt( 0, 0, 0); 
    camera.setFocalLength ( 25 );
    // === CONTROLS ===
    const controls = new PointerLockControls(camera, document.body);
    scene.add(controls.getObject());
    controls.getObject().position.y = player.height;

  
    const move = { forward: false, backward: false, left: false, right: false, up: false, down: false };

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
  
  //TEXTURES
  const loader = new THREE.TextureLoader();
  const uvMap = loader.load('./images/textures/BuMapConcrete.jpg');
  uvMap.wrapS = THREE.RepeatWrapping;
  uvMap.wrapT = THREE.RepeatWrapping;
  uvMap.repeat.set(20,2); 
  const marble = loader.load('./images/textures/marble_2.png');
  const weave = loader.load('./images/textures/weave.jpg');
  weave.wrapS = THREE.RepeatWrapping;
  weave.wrapT = THREE.RepeatWrapping;
  weave.repeat.set(40,40); 
  const concrete = loader.load('./images/textures/concrete.jpg');
  concrete.wrapS = THREE.RepeatWrapping;
  concrete.wrapT = THREE.RepeatWrapping;
  concrete.repeat.set(20,40); 
  // video schermo 1
  var videoQ = document.createElement('video');
  videoQ.src = "video/aqvam/aqvam_video_2Q.mp4";  
  videoQ.style.display = 'none'; 
  videoQ.muted = true;
  videoQ.loop = true; 
  document.body.appendChild(videoQ);
  videoQ.load();
  videoQ.play();
  var vTextureQ = new THREE.VideoTexture(videoQ);
  vTextureQ.minFilter = THREE.LinearFilter; 
  vTextureQ.magFilter = THREE.LinearFilter; 
  vTextureQ.format = THREE.RGBAFormat; 
  
  // video schermo 2  
  var videoQ = document.createElement('video');
  videoQ.src = "video/aqvam/aqvam_video_2Q.mp4";
  videoQ.muted = true;
  videoQ.loop = true;
  videoQ.playsInline = true;
  videoQ.autoplay = true;
  // invece di display:none
  videoQ.style.opacity = '0';
  videoQ.style.position = 'absolute';
  videoQ.style.width = '1px';
  videoQ.style.height = '1px';
  document.body.appendChild(videoQ);
  videoQ.play().catch(() => {});
  var vTextureQ = new THREE.VideoTexture(videoQ);
  vTextureQ.minFilter = THREE.LinearFilter;
  vTextureQ.magFilter = THREE.LinearFilter;
  vTextureQ.format = THREE.RGBAFormat;

  // video schermo 2
  var video = document.createElement('video');
  video.src = "video/aqvam/sphere_skin_2.mp4";
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.style.opacity = '0';
  video.style.position = 'absolute';
  video.style.width = '1px';
  video.style.height = '1px';
  document.body.appendChild(video);
  video.play().catch(() => {});
  var vTexture = new THREE.VideoTexture(video);
  vTexture.minFilter = THREE.LinearFilter;
  vTexture.magFilter = THREE.LinearFilter;
  vTexture.format = THREE.RGBAFormat;

  // video schermo 3
  var videoW = document.createElement('video');
  videoW.src = "video/video_textures/water_loop.mp4";
  videoW.muted = true;
  videoW.loop = true;
  videoW.playsInline = true;
  videoW.autoplay = true;
  videoW.style.opacity = '0';
  videoW.style.position = 'absolute';
  videoW.style.width = '1px';
  videoW.style.height = '1px';
  document.body.appendChild(videoW);
  videoW.play().catch(() => {});
  var vTextureW = new THREE.VideoTexture(videoW);
  vTextureW.minFilter = THREE.LinearFilter;
  vTextureW.magFilter = THREE.LinearFilter;
  vTextureW.format = THREE.RGBAFormat;

  // fallback per sicurezza
  document.addEventListener('click', () => {
    [videoQ, video, videoW].forEach(v => {
      if (v.paused) v.play().catch(() => {});
    });
  });
  
  ///Lights
  // ambiente
  const ambiente = new THREE.AmbientLight(0xffffff,0.3);

  scene.add(ambiente);

  // luci su pavimento
  const pointL7 = new THREE.PointLight(0x5555ff,0.5,10);
  pointL7.position.set(16,0.5,28);
  pointL7.castShadow = true; 
  pointL7.castShadow = true; 
  // scene.add(pointL7);  

  // === GRUPPO LUCI A SPIRALE ===
  const totalLights = 34;
  
  const spiralGroup = new THREE.Group();
  scene.add(spiralGroup);
  
  const colors = [
    0xff9966, 0xffcc33, 0xffff66, 0x99ff66, 0x33ff99, 0x33ffff,
    0x3399ff, 0x6666ff, 0xcc66ff, 0xff66cc, 0xff6666, 0xffffff,
    0xff9933, 0x66ff66, 0x33ccff, 0x9966ff, 0xcc99ff, 0xff99cc,
    0xffcc99, 0x99ffcc, 0x99ccff, 0xccffff, 0xffcccc, 0xccccff
  ];
  
  const lights = [];
  const timers = new Array(totalLights).fill(0);
  
  // === Parametri spirale ===
  const baseRadius = 13;
  const radiusStep = 0.7;
  const heightStep = 1.2;
  const angleStep = Math.PI / 6;
  
  // === Creazione luci ferme ===
  for (let i = 0; i < totalLights; i++) {
    const light = new THREE.PointLight(colors[i], 0, 10); // spente inizialmente
    const angle = i * angleStep;
    const radius = baseRadius + i * radiusStep;
    const x = Math.cos(angle) * radius;
    const y = i * heightStep * 0.4;
    const z = Math.sin(angle) * radius;
    light.position.set(x, y, z);
    spiralGroup.add(light);
    lights.push(light);
  }
  
  // === Accensione e spegnimento casuale ===
  function animateLights() {
    requestAnimationFrame(animateLights);
  
    for (let i = 0; i < totalLights; i++) {
      const light = lights[i];
  
      // Countdown casuale per ogni luce
      if (timers[i] <= 0) {
        timers[i] = Math.random() * 200 + 60; // tempo prima del prossimo cambio
        const turnOn = Math.random() < 0.7;   // 40% probabilità di accendersi
        light.intensity = turnOn ? 1 : 0;     // ON/OFF netto
      } else {
        timers[i]--;
      }
    }
  
    renderer.render(scene, camera);
  }
  
  animateLights();
  

  // BACKGROUND 
  const listenerBcg = new THREE.AudioListener();
  camera.add(listenerBcg);
  const audioLoader = new THREE.AudioLoader();
  const backgroundSound = new THREE.Audio( listenerBcg );
  audioLoader.load('audio/aqvam/659964__beussa__cavewaterdrops.mp3', function( buffer ) {
    backgroundSound.setBuffer( buffer );
    backgroundSound.setLoop( true );
    backgroundSound.setVolume(1);
    //backgroundSound.play();
  });
    
  // BACKGROUND 
  const listenerBcg2 = new THREE.AudioListener();
  camera.add(listenerBcg2);
  //const audioLoader2 = new THREE.AudioLoader();
  const backgroundSound2 = new THREE.Audio( listenerBcg );
  audioLoader.load('audio/aqvam/344762__briankennemer__orcas-island-ant-hill_cut.mp3', function( buffer ) {
    backgroundSound2.setBuffer( buffer );
    backgroundSound2.setLoop( true );
    backgroundSound2.setVolume(0.5);
    //backgroundSound2.play();
  });
 
  document.addEventListener('DOMContentLoaded', function() {
    let audioToggleButton = document.getElementById('audio-toggle-button');
    let muteIcon = document.getElementById('mute-icon');
    let audioIcon = document.getElementById('audio-icon');
    let isPlaying = false; // Initially not playing

    // Ensure audio is initially muted
    backgroundSound.pause();
    backgroundSound2.pause();

    audioToggleButton.addEventListener('click', function() {
        if (isPlaying) {
            backgroundSound.pause();
            backgroundSound2.pause();
            muteIcon.style.display = 'inline';
            audioIcon.style.display = 'none';
        } else {
            backgroundSound.play();
            backgroundSound2.play();
            muteIcon.style.display = 'none';
            audioIcon.style.display = 'inline';
        }
        isPlaying = !isPlaying;
    });
  });


  // GLTF
  // water
  const gWater = new THREE.BoxGeometry(40,1,40);  
  const mWater = new THREE.MeshPhysicalMaterial({  
    color: 0x5555ff,  
    roughness: 0,
    metalness: 0.2,
    ior:1.325,
    transparent: true,
    opacity: 0.5,            
    map: vTextureW,
    bumpMap:vTextureW,
    bumpScale:0.02,
    clearcoat:1,
    clearcoatMap: vTextureW,
  })
  const water = new THREE.Mesh( gWater, mWater );  
  water.position.set( 0,0.1, 0 );
  water.rotation.set(0,0,0);
  scene.add(water);


  // === SCENA  === //
  const lSala = new GLTFLoader(); 
  lSala.load(    
    '3d/aqvam/CV_Aqvam_Ambient_2.glb',
      function (glt) {
      const lSala = glt.scene;
      lSala.position.set(0,0,0);
      lSala.rotation.set(0,-Math.PI/2, 0 );  
      lSala.traverse(function (node) {
        if (node.isMesh) {
          const material = new THREE.MeshPhysicalMaterial({
            color:0x555555, 
            color: 0x333333,  
            roughness:1, 
            map: concrete,
            bumpMap:concrete,
            bumpScale:-0.001,
             side: THREE.DoubleSide
          });
          node.material = material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });      
      scene.add(lSala);   
    },   
    undefined,
    function (error) {
      console.error(error);      
    }     
  );

  // SHERMO INFERIORE
  const gSchermo = new THREE.CylinderGeometry(2,2,0.1,64,16);
  const mSchermo = new THREE.MeshPhysicalMaterial({    
    map:vTextureQ, 
    metalness: 0.5,
  })
  const schermo = new THREE.Mesh(gSchermo,mSchermo);
  schermo.position.set(0,1.66,0);
  schermo.rotation.set(0,1.66,0);
  scene.add(schermo);

  // SCHERMO SUPERIORE
  const gSchermo2 = new THREE.SphereGeometry(1.5,64,64);  
  const mSchermo2 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: vTexture,
    metalness: 0.5,   
  })
  const schermo2 = new THREE.Mesh(gSchermo2,mSchermo2);
  schermo2.position.set(0,5.5,0);
  schermo2.rotation.set(0,Math.PI/2,-Math.PI/2);
  scene.add(schermo2);

  const spotS1 = new THREE.SpotLight(0xddddff,1,10,1,1,1);
  spotS1.position.set(0,5,0);
  spotS1.lookAt(schermo);
  scene.add(spotS1);

  const targetObject1 = new THREE.Object3D();
  targetObject1.position.set(0,0,0);  
  scene.add(targetObject1);
  spotS1.target = targetObject1; 

  const spotS2 = new THREE.SpotLight(0xddddff,1,10,1,1,1);
  spotS2.position.set(0,1,0);
  spotS2.lookAt(schermo2);
  scene.add(spotS2);

  spotS1.castShadow = true;
  spotS2.castShadow = true;

  const targetObject2 = new THREE.Object3D();
  targetObject2.position.set(0,4.5,0);  
  scene.add(targetObject2);
  spotS2.target = targetObject2;  

  // Canvas ausiliari per estrarre i dati dei video
  const auxCanvas1 = document.createElement('canvas');
  const auxCtx1 = auxCanvas1.getContext('2d');
 
  const auxCanvas2 = document.createElement('canvas');
  const auxCtx2 = auxCanvas2.getContext('2d');

  function extractVideoData(video, auxCtx) {
    auxCanvas1.width = video.videoWidth;
    auxCanvas1.height = video.videoHeight;
    auxCtx.drawImage(video, 0, 0, auxCanvas1.width, auxCanvas1.height);
    const frame = auxCtx.getImageData(0, 0, auxCanvas1.width, auxCanvas1.height);
    const length = frame.data.length;
    let totalBrightness = 0;

    for (let i = 0; i < length; i += 4) {
      const r = frame.data[i];
      const g = frame.data[i + 1];
      const b = frame.data[i + 2];
      // Calcolo della luminosità del pixel
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
    }

    const averageBrightness = totalBrightness / (length / 4);
    return averageBrightness / 255; // Normalizza a un valore tra 0 e 1
  }

  function animateScene() {
    requestAnimationFrame(animateScene);

    if (videoQ.readyState === videoQ.HAVE_ENOUGH_DATA) {
      const brightness1 = extractVideoData(videoQ, auxCtx1);
      spotS1.intensity = brightness1 * 50;
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const brightness2 = extractVideoData(video, auxCtx2);
      spotS2.intensity = brightness2 * 50;     
    }

    if (controls.isLocked === true) {
      const delta = clock.getDelta();
      velocity.x -= velocity.x * 20.0 * delta;
      velocity.y -= velocity.y * 10.0 * delta;
      velocity.z -= velocity.z * 20.0 * delta;

      direction.z = Number(move.forward) - Number(move.backward);
      direction.x = Number(move.right) - Number(move.left);
      direction.y = Number(move.up) - Number(move.down);
      direction.normalize();

      if (move.forward || move.backward) velocity.z -= direction.z * player.speed * delta * 150;
      if (move.left || move.right) velocity.x -= direction.x * player.speed * delta * 150;
      if (move.up || move.down) velocity.y += direction.y* player.speed * delta * 150;

      

      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);
      controls.getObject().position.y += velocity.y * delta;
    }

    // ====== LIMITE DI DISCESA ======
    const floorHeight = 1.8;

    if (controls.getObject().position.y < floorHeight) {
        controls.getObject().position.y = floorHeight;
        velocity.y = 0; // blocca la velocità verso il basso
    }

    renderer.render(scene, camera);
  }
  animateScene();
};