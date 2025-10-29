import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';
import {FirstPersonControls} from './three_class/FirstPersonControls.js';
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
  const altezza = 4;
  const positionsM = [
  // Posizioni del fusto
 [500.0, altezza, 0.0],
  [475.52826, altezza, 154.5085],
  [404.5085, altezza, 293.89263],
  [293.89263, altezza, 404.5085],
  [154.5085, altezza, 475.52826],
  [0.0, altezza, 500.0],
  [-154.5085, altezza, 475.52826],
  [-293.89263, altezza, 404.5085],
  [-404.5085, altezza, 293.89263],
  [-475.52826, altezza, 154.5085],
  [-500.0, altezza, 0.0],
  [-475.52826, altezza, -154.5085],
  [-404.5085, altezza, -293.89263],
  [-293.89263, altezza, -404.5085],
  [-154.5085, altezza, -475.52826],
  [0.0, altezza, -500.0],
  [154.5085, altezza, -475.52826],
  [293.89263, altezza, -404.5085],
  [404.5085, altezza, -293.89263],
  [475.52826, altezza, -154.5085]
  ];
  const clock = new THREE.Clock();
  let mixer;
  window.resetCamera = resetCamera;
  // SCENE  
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(  0x00FFFFFF );

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
  camera.position.set(0,player.height,-400);
  
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
  // CONTROLS //////
  // const controls = new OrbitControls( camera, renderer.domElement );
  // controls.listenToKeyEvents( window );
  // controls.listenToKeyEvents( window );
  // controls.minDistance =  35;    
  // controls.maxDistance = 1500;
  // controls.maxPolarAngle = 1.5; 
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
  let initialCameraPosition = new THREE.Vector3();
  initialCameraPosition.copy(camera.position);
  function resetCamera() {
    camera.position.copy(initialCameraPosition);  
  }
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
  const ambient = new THREE.AmbientLight(0xFFFFFF,0.4); 
  scene.add( ambient);
  const spotLight = new THREE.SpotLight(0xffffff, 8);
  spotLight.position.set(0,3000,0);
  spotLight.angle = Math.PI/16;
  spotLight.penumbra = 0.5;
  spotLight.decay = 3;
  spotLight.distance = 9000;
  // spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 128;
  spotLight.shadow.mapSize.height = 128;
  spotLight.shadow.radius = 4;
  spotLight.shadow.camera.near = 0.5; 
  spotLight.shadow.camera.far = 4000;
  scene.add(spotLight);

  const spotHelper = new THREE.SpotLightHelper(spotLight);
  //scene.add(spotHelper);

  //POINTS 
  const pLight = new THREE.SpotLight(0xffffff,2,5000);  
  pLight.position.set(0,2000,0);  
  pLight.castShadow = true;  
  pLight.shadow.mapSize.width = 128; 
  pLight.shadow.mapSize.height = 128; 
  pLight.shadow.camera.near = 0.5; 
  pLight.shadow.camera.far = 10; 
  scene.add( pLight); 
  const pointH1 = new THREE.PointLightHelper(pLight,100);
  scene.add(pointH1);

  const pointLH1 = new THREE.PointLightHelper(pLight,1);
    scene.add( pointLH1 );
  const pLight2 = new THREE.PointLight( 0xFFFFFF,1,5000);  
  pLight2.position.set(100,200,100);  
  pLight2.castShadow = true;   
  pLight2.shadow.mapSize.width = 2048; // default
  pLight2.shadow.mapSize.height = 2048; // default
  pLight2.shadow.camera.near = 0.5; // default
  pLight2.shadow.camera.far = 100; // default
  // scene.add(pLight2);
  // ANIMATE SCENE //////
  function animateScene() {
  requestAnimationFrame(animateScene);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  // movimento FPS
  velocity.x -= velocity.x * 0.5 * delta;
  velocity.z -= velocity.z * 0.5 * delta;

  direction.z = Number(move.forward) - Number(move.backward);
  direction.x = Number(move.right) - Number(move.left);
  direction.normalize();

  if (move.forward || move.backward) velocity.z -= direction.z * 50 * delta;
  if (move.left || move.right) velocity.x -= direction.x * 50 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  if (move.up) {
  controls.getObject().position.y += 50 * delta;
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
  let skin = loader.load("images/textures/alluminium.jpg");
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
      'DEC414', 'FEF600', 'FEBE00', 'FFD700', 'C9A021',
      'FE005B', 'FF0000', 'A32590', 'FB46FF', 'DF73FF',
      '227BFF', '3E39FF', '222EFF', '001DEC', '2A23A3',
      '49C51A', '2D7121', '3C6232', '0A5C0A', '008000'
    ]; 
    // Definisci i gruppi di colori
    const gruppiColori = [
      colori.slice(0, 5),  // Primi 5 colori
      colori.slice(5, 10), // Successivi 5 colori
      colori.slice(10, 15), // Successivi 5 colori
      colori.slice(15, 20)  // Ultimi 5 colori
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
        scene.add(clone);
      }
      scene.add(ret);   
    })  
    ////// AMBIENTE GLTF //////////////////////
    let PSy = -100;
    
    const loaderPlanet = new GLTFLoader();
loaderPlanet.load('3d/heart/CV_Heart_color_2.glb', (gltf) => {
  const model = gltf.scene;
  model.traverse((node) => {
    if (node.isMesh) {
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

    

    ////////// BACKGROUND ///////
    const listenerBcg = new THREE.AudioListener();
    camera.add(listenerBcg);
    const audioLoader = new THREE.AudioLoader();
    const backgroundSound = new THREE.Audio( listenerBcg );
    audioLoader.load('audio/deep-meditation-192828.mp3', function( buffer ) {
      backgroundSound.setBuffer( buffer );
      backgroundSound.setLoop( true );
      backgroundSound.setVolume( 0.1 );
      backgroundSound.play();
    });  
    
    controls.lock(); 
  };