import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';
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
const positionsM = [
  // Posizioni del fusto
  [30, 5, 40],
  [38, 45, -20],
  [-3, 6, -3],
  [4.5, 9, -4.5],
  [-4.5, 12, 4.5],
  [0, 15, 0],
  [3, 18, -3],
  [-3, 21, 3],
  [4.5, 24, 4.5],
  [0, 27, 0],
  // Posizioni sotto la testa del fungo
  [15, 200, 0],
  [10.5, 200, 10.5],
  [0, 200, 15],
  [-10.5, 200, 10.5],
  [-15, 200, 0],
  [-10.5, 200, -10.5],
  [0, 230, -15],
  [10.5, 230, -10.5],
  [6, 240, 6],
  [-6, 240, -6],
];
  const clock = new THREE.Clock();
  window.resetCamera = resetCamera;
  // SCENE  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(  0x00FFFFFF );
  //scene.fog = new THREE.Fog( 0x0A9EE8, 1100, 1400 );
  scene.position.set(0,0,0);
  // CAMERA //////
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };  
  camera.position.set(0, 100, 600 ); 
  camera.rotation.set( 0, 0,Math.PI/2);
  camera.lookAt(new THREE.Vector3( 0, player.height, 0));  
  camera.setFocalLength (35);
  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    alpha:true, 
    antialias:true
  });
  // CONTROLS //////
  const controls = new OrbitControls( camera, renderer.domElement );  
  controls.listenToKeyEvents( window );
  controls.listenToKeyEvents( window );
  controls.minDistance =  35;    
  controls.maxDistance = 2000;
  controls.maxPolarAngle = 1.5;
 
  let initialCameraPosition = new THREE.Vector3();
  initialCameraPosition.copy(camera.position);
  // Crea una funzione per resettare la camera
  function resetCamera() {
    camera.position.copy(initialCameraPosition);  
  }
  // RENDERER
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  // renderer.shadowMap.type = THREE.VSMShadowMap;
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
  const ambient = new THREE.AmbientLight( 0xFFFFFF, 0.9 );  
  scene.add( ambient);
  //POINTS 
  const pLight = new THREE.PointLight( 0x88FFFF, 0.8, 5000 );  
  pLight.position.set( 300, 600, 300);  
  pLight.castShadow = true;  
  pLight.shadow.mapSize.width = 2048; // default
  pLight.shadow.mapSize.height = 2048; // default
  pLight.shadow.camera.near = 0.5; // default
  pLight.shadow.camera.far = 100; // default
  // scene.add( pLight); 
  const pLight2 = new THREE.PointLight( 0xFFFFFF, 2, 5000 );  
  pLight2.position.set( 0, 100, 0);  
  pLight2.castShadow = true;   
  pLight2.shadow.mapSize.width = 2048; // default
  pLight2.shadow.mapSize.height = 2048; // default
  pLight2.shadow.camera.near = 0.5; // default
  pLight2.shadow.camera.far = 100; // default
  scene.add( pLight2);
  // ANIMATE SCENE //////
  function animateScene(){
    requestAnimationFrame( animateScene );
    renderer.render( scene, camera );
  };
  animateScene();
  //TEXTURES
  const loader = new THREE.TextureLoader();


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
    'area1': '#E1BB0D', // giallo
    'area2': '#E10D0D', // rosso
    'area3': '#0DA5E1', // blu
    'area4': '#57D743', // verde
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

  ////////////// INSERIRE IL CIELO ROTANTE E DARGLI COME COLORE coloreOggetto////////////

  for (let i = 0; i < gruppiColori.length; i++) {
    if (gruppiColori[i].includes(coloreCorrente)) {
      forma = formeGeometriche[nomiFormeGeometriche[i]];
      break; 
    }
  }   

    if (!forma) {
      forma = formeGeometriche['octaedro'];;
    }
    // EMOTION MATERIAL
    const emoMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(v[1]),
      metalness: 0.5,
      roughness: 0.5,

    }); 

    //  EMOTION 1
    const emotion1 = new THREE.Mesh( forma, emoMaterial);  
    emotion1.position.set(-7.1, 13.5, -0.3 );
    emotion1.rotation.set( 0, 0, 0);
    emotion1.scale.set( 1.5, 1.5, 1.5 );    
    emotion1.castShadow = true; 
    emotion1.receiveShadow = true;    
    //  EMOTION 2
    let newMat = emoMaterial.clone()
    newMat.color = new THREE.Color(v[2] ? v[2] : v[1]);
    let forma2; 
    for (let i = 0; i < gruppiColori.length; i++) {
      const coloreCorrente2 = newMat.color.getHexString().toUpperCase();
      if (gruppiColori[i].includes(coloreCorrente2)) {
        forma2 = formeGeometriche[nomiFormeGeometriche[i]];    
        break; 
      }
    }
    if (!forma2) {
      forma2 = formeGeometriche['octaedro'];;
    }
    
    const emotion2 = new THREE.Mesh(forma2, newMat);  
    emotion2.position.set( -6.1, 12.5, -0.3 );
    emotion2.rotation.set( 0, 0, -Math.PI/3 );
    emotion2.scale.set( 1.3, 1.3, 1.3 );    
    emotion2.castShadow = true; 
    emotion2.receiveShadow = true;   
    // EMOTION 3 
    newMat = emoMaterial.clone();
    newMat.color = new THREE.Color(v[3] ? v[3] : v[1]);
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
    emotion3.position.set( -7.7, 11.6, -0.3 );
    emotion3.rotation.set( 0, 0, Math.PI/1.5 );
    emotion3.scale.set( 1.1, 1.1, 1.1 ); 
    emotion3.castShadow = true; 
    emotion3.receiveShadow = true;
    
    const ret = emotionGroup.clone(true);
    ret.add(emotion1, emotion2, emotion3);
    ret.scale.set(8,8,8);
    // ret.position.set( 0, k+0.5, 0); 
    scene.add(ret);  

    if (k < positionsM.length) {
      const [x, y, z] = positionsM[k];
      ret.position.set(x, y, z); // Imposta la posizione
    }
  })
  
  ////// AMBIENTE GLTF //////////////////////
  let PSy = -180;
  const loaderPlanet = new GLTFLoader();
  loaderPlanet.load('3d/heart/Hearts_Planet.glb', (gltf) => {
    const model = gltf.scene;
    // Attiva proiezione e ricezione ombre per ogni mesh nel modello
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;    // Proietta ombre
        node.receiveShadow = true; // Riceve ombre
      }
    });
    scene.add(model); // Aggiungi il modello alla scena
    model.position.set(0, PSy, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(20,20,20);     A
  });
  loaderPlanet.load(
    // resource URL
    '3d/heart/Planet_heart_2.glb',
    // called when the resource is loaded
    function ( gltf ) {
      //scene.add( gltf.scene );
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    },
    // called while loading is progressing
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error happened' );
    }
  ); 
  const loaderSky = new GLTFLoader();
  loaderSky.load('3d/heart/Sky.glb',(gltf) => {
    const model = gltf.scene;
    // Attiva proiezione e ricezione ombre per ogni mesh nel modello
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;    // Proietta ombre
        node.receiveShadow = true; // Riceve ombre
      }
    });
    scene.add(model); // Aggiungi il modello alla scena
    model.position.set(0, PSy, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(40,40,40);
    // Funzione per animare la rotazione sull'asse Z
    function animateSky() {
      requestAnimationFrame(animateSky); 
      model.rotation.y -= 0.0001; 
      model.rotation.z -= 0.0001; 
      renderer.render(scene, camera); // Renderizza la scena
    }
    // Avvia l'animazione
    animateSky();
  });

  loaderSky.load(
    // resource URL
    '3d/heart/Sky.glb',
    // called when the resource is loaded
    function ( gltf ) {
      //scene.add( gltf.scene );
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    },
    // called while loading is progressing
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error happened' );
    }
  );   
  /////////////////////////// BACKGROUND 
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

  // Selezioniamo i pulsanti
  let cameraButton = document.querySelector('#btn-camera button');  
  let audioButton = document.querySelector('#btn-audio button');
  let isPlaying = true;
  cameraButton.addEventListener('click', function() {
    resetCamera();
  });
  audioButton.addEventListener('click', function() {
    if (isPlaying) {
      backgroundSound.pause();
    } else {
      backgroundSound.play();
    }
    // Cambiamo lo stato
    isPlaying = !isPlaying;
  });
  
  // Funzione per resettare la camera
  function resetCamera() {
    camera.position.set( 0, 0, 80 ); 
    camera.rotation.set( 1, 0, 0 );
    camera.lookAt(new THREE.Vector3( 0, player.height, 0)); 
    controls.listenToKeyEvents( window );
    controls.minDistance =  5;    
    controls.maxDistance = 1100;
    controls.maxPolarAngle = 1.5; 
  }    
};