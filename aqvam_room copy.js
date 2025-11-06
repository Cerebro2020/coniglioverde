import * as THREE from 'three';
import { PointerLockControls } from './three_class/PointerLockControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';

export default function(){ 
    
  const clock = new THREE.Clock();
    // === SCENE  ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x008888 );  
    scene.fog = new THREE.Fog(0x008888, 10, 100);
     // === PLAYER ===
    let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
    // camera.position.set(18,player.height+5,30);
    camera.position.set(0,player.height+5,0);
   
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
  const marble = loader.load('./images/textures/marble_2.jpg');
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
  var video = document.createElement('video');
  video.src = "video/aqvam/sphere_skin.mp4";  
  video.style.display = 'none'; 
  video.muted = true;
  video.loop = true; 
  document.body.appendChild(video);
  video.load();
  video.play();
  var vTexture = new THREE.VideoTexture(video);
  vTexture.minFilter = THREE.LinearFilter; 
  vTexture.magFilter = THREE.LinearFilter; 
  vTexture.format = THREE.RGBAFormat;   
  
  var videoW = document.createElement('video');
  videoW.src = "video/video_textures/water_loop.mp4";
  videoW.style.display = 'none'; 
  videoW.muted = true;
  videoW.loop = true; 
  document.body.appendChild(videoW);
  videoW.load();
  videoW.play();
  var vTextureW = new THREE.VideoTexture(videoW);
  vTextureW.minFilter = THREE.LinearFilter;
  vTextureW.magFilter = THREE.LinearFilter;
  vTextureW.format = THREE.RGBAFormat;
  
  ///Lights
  // ambiente
  const ambiente = new THREE.AmbientLight(0xffffff,0.175+0.3);
  // 1
  const pointL = new THREE.PointLight(0x5555ff,0.5,4); 
  pointL.position.set(0,1,12.5);
  // 2
  const pointL2 = new THREE.PointLight(0x5555ff,0.5,4); 
  pointL2.position.set(0,1,-12.5);
  // 3 
  const pointL3 = new THREE.PointLight(0x5555ff,0.5,4); 
  pointL3.position.set(-12.5,1,12.5);
  const pointL4 = new THREE.PointLight(0x5555ff,0.5,10);
  pointL4.position.set(12.5,1,12.5);
  const pointL5 = new THREE.PointLight(0x5555ff,0.5,10);
  pointL5.position.set(-12.5,1,-12.5);
  const pointL6 = new THREE.PointLight(0x5555ff,0.5,10);
  pointL6.position.set(12.5,1,-12.5); 

  pointL.castShadow = true;
  pointL2.castShadow = true;
  pointL3.castShadow = true; 
  pointL4.castShadow = true; 
  pointL5.castShadow = true; 
  pointL6.castShadow = true; 

  scene.add(ambiente);
  scene.add(pointL);  
  scene.add(pointL2);
  scene.add(pointL3);  
  scene.add(pointL4);
  scene.add(pointL5);
  scene.add(pointL6);

  // luci su pavimento
  const pointL7 = new THREE.PointLight(0x5555ff,0.5,10);
  pointL7.position.set(16,0.5,28);
  pointL7.castShadow = true; 
  pointL7.castShadow = true; 
  scene.add(pointL7);  

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
  // 01 Pavimento 
  const lSala = new GLTFLoader();

  /*
  lSala.load(    
    '3d/aqvam/01_hangar_2.glb',
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
  // 02 Pool
  const lPool = new GLTFLoader();
  lPool.load(    
    '3d/aqvam/02_pool.glb',
      function (glt) {
      const lPool = glt.scene;
      lPool.position.set(0,0,0);
      lPool.rotation.set(0,0,0 );  
      lPool.traverse(function (node) {
        if (node.isMesh) {
          const material = new THREE.MeshPhysicalMaterial({
            color:0x111111,   
            roughness:0, 
            metalness: 0.5,
            ior: 1.460,
          });
          node.material = material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });      
      scene.add(lPool);   
    },   
    undefined,
    function (error) {
      console.error(error);      
    }     
  );
  // 03 Passerelle
  const lPasserelle = new GLTFLoader();
  lPasserelle.load(    
    '3d/aqvam/03_passerelle_3.glb',
      function (glt) {
      const lPasserelle = glt.scene;
      lPasserelle.position.set(0,0,0);
      lPasserelle.rotation.set(0,-Math.PI/2, 0 ); 
      lPasserelle.traverse(function (node) {
        if (node.isMesh) {
          const material = new THREE.MeshPhysicalMaterial({
            color:0x333333,
            map: weave,  
            roughness: 0.8,        
            bumpMap:weave,
            bumpScale: 0.001,
            reflectivity:0,             
          });
          node.material = material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });   
      lPasserelle.castShadow = true,
      lPasserelle.receiveShadow = true,   
      scene.add(lPasserelle);
    },   
    undefined,
    function (error) {
      console.error(error);      
    }     
  );  
  // 04 Vasca
  const lVasca = new GLTFLoader();
  lVasca.load(    
    '3d/aqvam/04_vasca.glb',
      function (glt) {
      const lVasca = glt.scene;
      lVasca.position.set(0,0,0);
      lVasca.rotation.set(0, Math.PI/2, 0 );  
      lVasca.traverse(function (node) {
        if (node.isMesh) {
          const material = new THREE.MeshPhysicalMaterial({
            color:0xffffff,
            map: marble,  
            roughness: 0,
            metalness: 0.5,
            emissive: 0x000000,
            emissiveIntensity: 1,
            ior: 1.486,
            reflectivity: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            bumpMap:uvMap,
            bumpScale: 0.001,      
          });
          node.material = material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });      
      scene.add(lVasca);
    },   
    undefined,
    function (error) {
      console.error(error);      
    }     
  );
  // 05_visitors
  const lVisitors = new GLTFLoader();
  lVisitors.load(    
    '3d/aqvam/05_visitors_3.glb',
      function (glt) {
      const lVisitors = glt.scene;
      lVisitors.position.set(0,0,0);
      lVisitors.rotation.set(0,-Math.PI/2, 0 ); 
      lVisitors.traverse(function (node) {
        if (node.isMesh) {
          const material = new THREE.MeshPhysicalMaterial({
            color:0x664488,            
          });
          node.material = material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });      
      scene.add(lVisitors);
    },   
    undefined,
    function (error) {
      console.error(error);      
    }     
  );
  // 06_capsula
  const lCapsula = new GLTFLoader();
  lCapsula.load(    
    '3d/aqvam/06_capsule_5.glb',
      function (glt) {
      const lCapsula = glt.scene;
      lCapsula.position.set(0,0,0);
      lCapsula.rotation.set(0, -Math.PI/2, 0 );   
      lCapsula.traverse(function (node) {
        if (node.isMesh) {
          const material = new THREE.MeshPhysicalMaterial({
            color:0x333333,
            map: weave,  
            roughness: 0.5,        
            bumpMap:weave,
            bumpScale: 0.001,
            reflectivity:0,      
          });
          node.material = material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });      
      scene.add(lCapsula);
    },   
    undefined,
    function (error) {
      console.error(error);      
    }     
  ); */

loader.load(
  '3d/aqvam/CV_Aqvam_Ambient_2.glb',
  function (glt) {
    const lSala = glt.scene;
    lSala.position.set(0, 0, 0);
    lSala.rotation.set(0, -Math.PI / 2, 0);

    lSala.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.side = THREE.DoubleSide; // opzionale
      }
    });

    scene.add(lSala);
  },
  undefined,
  (error) => console.error(error)
);

  //schermo 1
  const gSchermo = new THREE.CylinderGeometry(2,2,0.1,64,16);
  const mSchermo = new THREE.MeshPhysicalMaterial({    
    map:vTextureQ, 
    metalness: 0.5,
  })
  const schermo = new THREE.Mesh(gSchermo,mSchermo);
  schermo.position.set(0,1.66,0);
  schermo.rotation.set(0,1.66,0);
  scene.add(schermo);
  // schermo 2
  const gSchermo2 = new THREE.SphereGeometry(1.5,64,64);  
  const mSchermo2 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map:vTexture, 
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
      pointL.intensity = brightness2 * 100;
      pointL2.intensity = brightness2 * 100;
      pointL3.intensity = brightness2 * 100;
      pointL4.intensity = brightness2 * 100;
      pointL5.intensity = brightness2 * 100;
      pointL6.intensity = brightness2 * 100;
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
    renderer.render(scene, camera);
  }
  animateScene();
  // if (typeof controls !== 'undefined') controls.enabled = false;
};