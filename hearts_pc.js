import * as THREE from 'three';
import { PointerLockControls } from './three_class/PointerLockControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';

export default function(choose, quadri){

  const colore0 = choose[0][0]; 
  const colore1 = choose[0][1]; 
  const colore2 = choose[1][1];
  const colore3 = choose[2][1]; 
  const colore4 = choose[3][1];
  const colore5 = choose[4][1]; 
  const colore6 = choose[5][1];
  const colore7 = choose[6][1]; 
  const colore8 = choose[7][1];
  const colore9 = choose[8][1]; 
  const colore10 = choose[9][1];
  const colore11 = choose[10][1]; 
  const colore12 = choose[11][1];
  const colore13 = choose[12][1]; 
  const colore14 = choose[13][1];
  const colore15 = choose[14][1]; 
  const colore16 = choose[15][1];
  const colore17 = choose[16][1]; 
  const colore18 = choose[17][1];
  const colore19 = choose[18][1]; 
  const colore20 = choose[19][1];
  //////////////// ARRAY POSIZIONI /////////////
  
  const clock = new THREE.Clock();
  let mixer;
  // window.resetCamera = resetCamera;
  // SCENE  
  const scene = new THREE.Scene();
  const loader2 = new THREE.TextureLoader();
  loader2.load('images/equiangular/Esky2.png', texture => {
    texture.colorSpace = THREE.SRGBColorSpace;// colori corretti
    texture.mapping = THREE.EquirectangularReflectionMapping; // per immagine 2:1
    scene.background = texture;// visibile come sfondo
  });
  scene.position.set(0,0,0);
  // CAMERA //////
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };  
  camera.position.set(0,player.height,-1200);
  
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,     // salita con SPACE
    down: false    // discesa con SHIFT
  };
  
  const video = document.createElement('video');
  video.src = "video/video_textures/water_loop.mp4";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.style.display = "none";
  document.body.appendChild(video);
  video.load();
  video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;

  document.addEventListener('keydown', event => {
    switch (event.code) {
      case 'KeyW': move.forward = true; break;
      case 'KeyS': move.backward = true; break;
      case 'KeyA': move.left = true; break;
      case 'KeyD': move.right = true; break;
      case 'Space': move.up = true; break;
      case 'ShiftLeft': move.down = true; break;
    }
  });

    document.addEventListener('keyup', event => {
      switch (event.code) {
        case 'KeyW': move.forward = false; break;
        case 'KeyS': move.backward = false; break;
        case 'KeyA': move.left = false; break;
        case 'KeyD': move.right = false; break;
        case 'Space': move.up = false; break;
        case 'ShiftLeft': move.down = false;  break;
      }
  }); 

  
  camera.rotation.set(0,0,0);
  camera.lookAt(new THREE.Vector3( 0, player.height, 1000)); 
  camera.setFocalLength (25);
  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    alpha:true, 
    antialias:true
  });
  
  const controls = new PointerLockControls(camera, document.body); 

  controls.addEventListener('lock', () => {
    console.log('Controllo attivato');
  });

  controls.addEventListener('unlock', () => {
    console.log('Controllo disattivato');
  });
  
  renderer.domElement.addEventListener('click', () => {
    if (!controls.isLocked) {
      controls.lock();
    }
  });
  // CAMERA 
  // let initialCameraPosition = new THREE.Vector3();
  // initialCameraPosition.copy(camera.position);
  // function resetCamera() {
  //   camera.position.copy(initialCameraPosition);  
  // }
  // RENDERER
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.9;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement ); 
  renderer.xr.enabled = true,    
  // RESIZE WINDOW //////
   window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  } ); 
  // LIGHTS //////
  //AMBIENT
  const ambient = new THREE.AmbientLight(0xFFFFFF,1);   
  scene.add( ambient);
  /* === SPOT LIGHTS ===*/
  const spotLight = new THREE.SpotLight(0xffffff, 5);
  spotLight.position.set(0,3000,0);
  spotLight.angle = Math.PI/16;
  spotLight.penumbra = 0.5;
  spotLight.decay = 3;
  spotLight.distance = 9000;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.radius = 4;
  spotLight.shadow.camera.near = 0.1; 
  spotLight.shadow.camera.far = 10000;
  spotLight.shadow.bias = -0.0005;
  scene.add(spotLight);
  
  const spotLight2 = new THREE.SpotLight(0xffffff, 10);
  spotLight2.position.set(0,3000,0);
  spotLight2.angle = Math.PI/4;
  spotLight2.penumbra = 0.5;
  spotLight2.decay = 3;
  spotLight2.distance = 9000;
  spotLight2.castShadow = true;
  spotLight2.shadow.mapSize.width = 2048;
  spotLight2.shadow.mapSize.height = 2048;
  spotLight2.shadow.radius = 4;
  spotLight2.shadow.camera.near = 0.1; 
  spotLight2.shadow.camera.far = 10000;
  spotLight2.shadow.bias = -0.0005;
  scene.add(spotLight2);  
  /* === POINTS === */
  let plPower = 1;

  const pLight = new THREE.PointLight(0xFFFFFF,plPower,500);  
  pLight.position.set(-360,400,360);  
  pLight.castShadow = true;  
  pLight.shadow.mapSize.width = 2048; 
  pLight.shadow.mapSize.height = 2048; 
  pLight.shadow.camera.near = 0.5; 
  pLight.shadow.camera.far = 10; 
  pLight.shadow.bias = -0.0005;
  scene.add( pLight); 

  const pLight2 = new THREE.PointLight( 0xFFFFFF,plPower,500);  
  pLight2.position.set(360,400,-360);  
  pLight2.castShadow = true;   
  pLight2.shadow.mapSize.width = 2048; 
  pLight2.shadow.mapSize.height = 2048;
  pLight2.shadow.camera.near = 0.5; 
  pLight2.shadow.camera.far = 100;
  pLight2.shadow.bias = -0.0005; 
  scene.add(pLight2);

  const pLight3 = new THREE.PointLight(0xFFFFFF,plPower,500);  
  pLight3.position.set(360,400,360);  
  pLight3.castShadow = true;  
  pLight3.shadow.mapSize.width = 2048; 
  pLight3.shadow.mapSize.height = 2048; 
  pLight3.shadow.camera.near = 0.5; 
  pLight3.shadow.camera.far = 10; 
  pLight3.shadow.bias = -0.0005;
  scene.add( pLight3); 

  const pLight4 = new THREE.PointLight( 0xFFFFFF,plPower,500);  
  pLight4.position.set(-360,400,-360);  
  pLight4.castShadow = true;   
  pLight4.shadow.mapSize.width = 2048; 
  pLight4.shadow.mapSize.height = 2048;
  pLight4.shadow.camera.near = 0.5; 
  pLight4.shadow.camera.far = 100;
  pLight4.shadow.bias = -0.0005; 
  scene.add(pLight3,pLight4);

  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  const pLightHelper = new THREE.PointLightHelper(pLight);
  const pLight2Helper = new THREE.PointLightHelper(pLight2, 100);

  // Aggiungi tutti gli helper alla scena
  // scene.add(spotLightHelper, pLightHelper, pLight2Helper);

  // ANIMATE SCENE //////
    function animateScene() {
    requestAnimationFrame(animateScene);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    // movimento FPS
    velocity.x -= velocity.x * 5 * delta;
    velocity.z -= velocity.z * 5 * delta;
    direction.z = Number(move.forward) - Number(move.backward);
    direction.x = Number(move.right) - Number(move.left);
    direction.normalize();
    if (move.forward || move.backward) velocity.z -= direction.z * 1000 * delta;
    if (move.left || move.right) velocity.x -= direction.x * 1000 * delta;
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    if (move.up) {
    controls.getObject().position.y += 500 * delta;
  }
  const floorHeight = 1.8;
  if (move.down) {
    if (controls.getObject().position.y > floorHeight) {
      controls.getObject().position.y -= 50 * delta;
      // Evita di andare sotto al pavimento
      if (controls.getObject().position.y < floorHeight) {
        controls.getObject().position.y = floorHeight;
      }
    }
  }
    renderer.render(scene, camera);
  }
  animateScene();
  //TEXTURES
  const loader = new THREE.TextureLoader();
  let skin = loader.load("images/textures/marble_2.png");
  skin.wrapS = THREE.RepeatWrapping;
  skin.wrapT = THREE.RepeatWrapping;
  skin.repeat.set(8,8);
  let skin2 = loader.load("images/textures/Bronze.jpg");
  let skin2Trans = loader.load("images/textures/skin2T.png");
  skin2Trans.colorSpace = THREE.NoColorSpace;
  // GRUPPO EMOZIONI //////
  let emotionGroup = new THREE.Group();
  const emozioni=_.map(choose,(v,k)=>{
    const formeGeometriche = {
      'sfera': new THREE.SphereGeometry( 0.8, 16, 16 ),
      'piramide': new THREE.ConeGeometry( 1, 2, 4 ),      
      'cubo': new THREE.BoxGeometry( 1.2, 1.2, 1.2 ),
      'dodecaedro': new THREE.DodecahedronGeometry( 1, 0 ),
      'octaedro': new THREE.OctahedronGeometry( 1, 1 )
    };
    const nomiFormeGeometriche = ['dodecaedro','sfera', 'cubo','piramide'  ];    
     const colori = [
      'DEC414', 'FEF600', 'FFD700', 'C9A021',
      'FE005B', 'FF0000', 'A32590', 'DF73FF',
      '227BFF', '222EFF', '001DEC', '2A23A3',
      '49C51A', '2D7121', '3C6232', '008000',
    ];   
    // Definisci i gruppi di colori
    const gruppiColori = [
      colori.slice(0, 4),  // Primi 4 colori
      colori.slice(4, 8), // Successivi 4 colori
      colori.slice(8, 12), // Successivi 4 colori
      colori.slice(12, 16)  // Ultimi 4 colori
    ];      
    const coloreCorrente = new THREE.Color(v[1]).getHexString().toUpperCase(); 
    let contaCorrente = [];
    for (let i = 0; i < gruppiColori.length; i++){
    contaCorrente.push('coloreCorrente');
    }
    let forma;
///////////////////////////////////////////////
  // Inizializza un array per tenere traccia del conteggio delle aree
  let conteggioAree = [0, 0, 0, 0];
  let mappaColori = {
    'area1': '#f0e73cff', // giallo
    'area2': '#f32727ff', // rosso
    'area3': '#2fb8eeff', // blu
    'area4': '#6bc043ff', // verde
    'areaEquivalente': '#777777' // arancione per scelte equivalenti
  };
  // Itera su ogni colore scelto
  for (let quad in choose) {
    // Ottieni il colore corrente
    let coloreCorrente = new THREE.Color(choose[quad][1]).getHexString().toUpperCase();
    // Determina a quale area appartiene il colore
    let indiceArea;
    for (let i = 0; i < gruppiColori.length; i++) {
      if (gruppiColori[i].includes(coloreCorrente)) {
        indiceArea = i;
        break;
      }
    }
    // Aggiorna il conteggio per l'area solo se il colore corrente non è bianco
    if (indiceArea !== undefined && choose[quad][1] !== '#FFFFFF') {
      conteggioAree[indiceArea]++;
    }
  }
  // Trova il massimo conteggio
  let maxConteggio = Math.max(...conteggioAree);
  // Verifica se ci sono più aree con lo stesso massimo conteggio
  let areeEquivalenti = conteggioAree.filter(conteggio => conteggio === maxConteggio).length > 1;
  let coloreOggetto;
  // Se ci sono scelte equivalenti, usa il colore per scelte equivalenti
  if (areeEquivalenti) {
    coloreOggetto = mappaColori['areaEquivalente'];
  } else {
    // Trova l'area con il maggior numero di scelte
    let areaPiuScelta = conteggioAree.indexOf(maxConteggio);
    // Se nessun'area è stata scelta (tutte hanno conteggio 0), usa il colore bianco
    coloreOggetto = maxConteggio > 0 ? mappaColori[`area${areaPiuScelta + 1}`] : '#FFFFFF';
  }
  console.log(`Il colore dell'oggetto è ${coloreOggetto}.`);
    /////// INSERIRE IL CIELO ROTANTE////////////
    for (let i = 0; i < gruppiColori.length; i++) {
      if (gruppiColori[i].includes(coloreCorrente)) {
        forma = formeGeometriche[nomiFormeGeometriche[i]];
        break; 
        }
      }
        if (!forma) {
        forma = formeGeometriche['octaedro'];
      }
      // EMOTION MATERIAL
      const emoMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(v[1]),
        metalness: 0.5,
        metalnessMap: skin2,
        roughness: 0,
        roughnessMap: skin2,
        map: skin2,
        bumpMap: skin2,
        bumpScale: 1,     
        alphaMap: skin2Trans,
        transparent: true,
        opacity: 1,
      });
      //  EMOTION 1
      const emotion1 = new THREE.Mesh( forma, emoMaterial);  
      emotion1.position.set(-7.1,13.5,-0.3);
      emotion1.rotation.set(
        0,
        Math.PI/4,     
        0
      );
      emotion1.scale.set(1.5,1.5,1.5);    
      emotion1.castShadow = true; 
      emotion1.receiveShadow = true;    
      //  EMOTION 2
      let newMat = emoMaterial.clone()
      newMat.color = new THREE.Color(v[2] ? v[2] : v[0]);
      let forma2; 
      for (let i = 0; i < gruppiColori.length; i++) {
        const coloreCorrente2 = newMat.color.getHexString().toUpperCase();
        if (gruppiColori[i].includes(coloreCorrente2)) {
          forma2 = formeGeometriche[nomiFormeGeometriche[i]];    
          break; 
        }
      }
      if (!forma2) {
        forma2 = formeGeometriche['octaedro'];
      }    
      const emotion2 = new THREE.Mesh(forma2, newMat);  
      emotion2.position.set(-7.9,11.25,-0.3);
      emotion2.rotation.set(
        Math.PI/4,
        0,
        Math.PI/2
      );
      emotion2.scale.set(1,1,1);    
      emotion2.castShadow = true; 
      emotion2.receiveShadow = true;   
      // EMOTION 3 
      newMat = emoMaterial.clone();
      newMat.color = new THREE.Color(v[3] ? v[3] : v[0]);
      let forma3;
      for (let i = 0; i < gruppiColori.length; i++) {
        const coloreCorrente2 = newMat.color.getHexString().toUpperCase();
        if (gruppiColori[i].includes(coloreCorrente2)) {
          forma3 = formeGeometriche[nomiFormeGeometriche[i]]; 
          break;
        }
      }  
      if (!forma3) {
        forma3 = formeGeometriche['octaedro'];
      }       
      const emotion3 = new THREE.Mesh(forma3, newMat);  
      emotion3.position.set(-6.1,11.5,-0.3);
      emotion3.rotation.set(
        Math.PI/4,
        0,
        Math.PI/-2
      );
      emotion3.scale.set(0.7,0.7,0.7); 
      emotion3.castShadow = true; 
      emotion3.receiveShadow = true;    
      const ret = emotionGroup.clone(true);
      ret.add(emotion1, emotion2, emotion3);
      ret.scale.set(10,10,10);
      ret.position.set(30,(k*25)-180,-70);
      ret.rotation.set(
        0,
        k*Math.PI/-16,
        k*Math.PI/-16,
      );
      let randomValue = Math.floor(Math.random() * 2) + 1.5;
      const numCopies = 12;
      const raggio = 200;// maggiore distanza
      for (let i = 0; i < numCopies; i++) {
        const clone = ret.clone(true);
        // capovolgi l’ordine (prima scelta davanti)
        const angolo = ((numCopies - 1 - i) / numCopies) * Math.PI * 2;
        clone.position.set(
          Math.cos(-angolo) * raggio,
          0,
          Math.sin(-angolo) * raggio
        );
        clone.rotation.y = angolo; 
        clone.scale.set(5,5,5);
        clone.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          node.material.transparent = true;
          node.material.opacity = 1;  // o quanto vuoi
        }
      });
        
       
        scene.add(clone);
      }
      scene.add(ret);   
    })  
    ////// AMBIENTE GLTF //////////////////////
    let PSy = -100;
    
    const loaderPlanet = new GLTFLoader();
    loaderPlanet.load('3d/heart/CV_Heart_Cupola.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse((node) => {
        if (node.isMesh) {
          // node.material.map = skin;
          node.castShadow = true;
          node.receiveShadow = true;
          node.material.side = THREE.DoubleSide;
        }
      });
      model.position.set(0, PSy, 0);
      model.rotation.set(0, Math.PI / 28.5, 0);
      const scala = 400;
      model.scale.set(scala, scala, scala);
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    controls.lock(); // se vuoi avviare il controllo qui
  });

  

  let radiusC = 900;
  let poolG = new THREE.CylinderGeometry(radiusC,radiusC,0.5,32);
  let poolM = new THREE.MeshPhysicalMaterial({
    color: 0Xffccff,
    map: videoTexture,
    metalness: 0.05,
    roughness: 0.1,
    transmission: 1.0, 
    transparent: true,
    opacity: 0.5,
    ior: 1.333,  
    thickness: 1.5,    
    displacementMap: videoTexture,
    displacementScale: 0, 
    clearcoat: 1,        
    clearcoatRoughness: 0.05,
  });

  let pool = new THREE.Mesh(poolG,poolM);
  pool.position.set(0,-102,0);
  pool.rotation.set(0,Math.PI,0);
  pool.receiveShadow = true;
  scene.add(pool);

  
    

    ////////// BACKGROUND ///////
    // === BACKGROUND AUDIO + TOGGLE ===
const listenerBcg = new THREE.AudioListener();
camera.add(listenerBcg);
const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listenerBcg);

// elementi UI (già presenti in hearts_pc.html)
const audioToggleButton = document.getElementById('audio-toggle-button');
const muteIcon = document.getElementById('mute-icon');
const audioIcon = document.getElementById('audio-icon');

// stato iniziale: ATTIVO
let isPlaying = true;
function syncIcons() {
  if (!muteIcon || !audioIcon) return;
  if (isPlaying) {
    muteIcon.style.display = 'none';
    audioIcon.style.display = 'inline';
  } else {
    muteIcon.style.display = 'inline';
    audioIcon.style.display = 'none';
  }
}
syncIcons();

// carica e avvia audio
audioLoader.load('audio/deep-meditation-192828.mp3', (buffer) => {
  backgroundSound.setBuffer(buffer);
  backgroundSound.setLoop(true);
  backgroundSound.setVolume(0.1);
  // la scena parte da un click su "RESULT", quindi l’autoplay è consentito
  backgroundSound.play();
});

// click toggle
if (audioToggleButton) {
  audioToggleButton.addEventListener('click', () => {
    if (isPlaying) {
      backgroundSound.pause();
    } else {
      backgroundSound.play();
    }
    isPlaying = !isPlaying;
    syncIcons();
  });
} else {
  console.warn('audio-toggle-button non trovato');
}  

    
    controls.lock(); 
    
  };