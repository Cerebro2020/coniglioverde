import * as THREE from 'three';
import {OrbitControls} from '../three_class/OrbitControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function(choose, quadri){  

  // Colori per eventuale debug (non usati ma lasciati per compatibilità)
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

  let allRet = [];
  let retDaAnimare = null;
  const clock = new THREE.Clock();
  let mixer;
  const t = clock.elapsedTime;

  // SCENE  
  const scene = new THREE.Scene();
  const loader2 = new THREE.TextureLoader();
  loader2.load('images/equiangular/Space_4.jpg', texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  });
  scene.position.set(0,-300,0); 

  // CAMERA ////// 
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };  
  camera.position.set(0,400,-1300);

  camera.rotation.set(0,0,0);
  camera.lookAt(new THREE.Vector3( 0, player.height, 1000)); 
  camera.setFocalLength(25);

  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    alpha:true, 
    antialias:true
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 35;
  controls.maxDistance = 1900;
  controls.maxPolarAngle = 1.5;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.update();  

  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.9;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement ); 
  renderer.xr.enabled = true;
    
  // RESIZE WINDOW ////// 
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }); 

  // LIGHTS ////// 
  const ambient = new THREE.AmbientLight(0xFFFFFF,0.5);   
  scene.add( ambient);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
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
  
  const spotLight2 = new THREE.SpotLight(0xffffff, 1);
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

  let plPower = 1;

  const pLight = new THREE.PointLight(0xFFFFFF,plPower,500);  
  pLight.position.set(-360,400,360);  
  pLight.castShadow = true;  
  pLight.shadow.mapSize.width = 2048; 
  pLight.shadow.mapSize.height = 2048; 
  pLight.shadow.camera.near = 0.5; 
  pLight.shadow.camera.far = 10; 
  pLight.shadow.bias = -0.0005;
  scene.add(pLight); 

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
  scene.add(pLight3); 

  const pLight4 = new THREE.PointLight( 0xFFFFFF,plPower,500);  
  pLight4.position.set(-360,400,-360);  
  pLight4.castShadow = true;   
  pLight4.shadow.mapSize.width = 2048; 
  pLight4.shadow.mapSize.height = 2048;
  pLight4.shadow.camera.near = 0.5; 
  pLight4.shadow.camera.far = 100;
  pLight4.shadow.bias = -0.0005; 
  scene.add(pLight3,pLight4);  

  // TEXTURES
  const loader = new THREE.TextureLoader();
  let skin = loader.load("images/textures/marble_2.png");
  skin.wrapS = THREE.RepeatWrapping;
  skin.wrapT = THREE.RepeatWrapping;
  skin.repeat.set(8,8);

  let skin2 = loader.load("images/textures/Bronze.jpg");
  let skin2Trans = loader.load("images/textures/skin2T.png");
  skin2Trans.colorSpace = THREE.NoColorSpace;

  // ----------------------------------------------------
  //  CALCOLO COLORE DOMINANTE (UNA SOLA VOLTA, STILE POMO)
  // ----------------------------------------------------

  const colori = [
    'DEC414', 'FEF600', 'FFD700', 'C9A021',
    'FE005B', 'FF0000', 'A32590', 'DF73FF',
    '227BFF', '222EFF', '001DEC', '2A23A3',
    '49C51A', '2D7121', '3C6232', '008000',
  ];

  const gruppiColori = [
    colori.slice(0, 4),   // gialli
    colori.slice(4, 8),   // rossi
    colori.slice(8, 12),  // blu
    colori.slice(12, 16)  // verdi
  ];

  function calcolaColoreDominante(choose, gruppiColori) {
    let conteggioAree = [0, 0, 0, 0];

    for (let quad in choose) {
      const v = choose[quad];
      if (!v || v.length < 2) continue;
      const c = v[1];
      if (!c || c === '#FFFFFF') continue;

      const hex = new THREE.Color(c).getHexString().toUpperCase();
      let indiceArea;
      for (let i = 0; i < gruppiColori.length; i++) {
        if (gruppiColori[i].includes(hex)) {
          indiceArea = i;
          break;
        }
      }
      if (indiceArea !== undefined) {
        conteggioAree[indiceArea]++;
      }
    }

    const maxConteggio = Math.max(...conteggioAree);
    if (maxConteggio === 0) return '#FFFFFF';

    const nMax = conteggioAree.filter(v => v === maxConteggio).length;
    if (nMax > 1) return '#777777'; // parità

    const areaPiuScelta = conteggioAree.indexOf(maxConteggio);
    const mappaColori = {
      0: '#fff200', // giallo
      1: '#ff0000', // rosso
      2: '#007afd', // blu
      3: '#50fd00'  // verde
    };
    return mappaColori[areaPiuScelta] || '#FFFFFF';
  }

  const coloreOggetto = calcolaColoreDominante(choose, gruppiColori);
  console.log('Colore dominante finale:', coloreOggetto);

  // SFERA GLOBALE (EMOTION TOTALE) – UNA SOLA VOLTA
  let gTotale = new THREE.SphereGeometry(100, 16, 16);
  let matTotale = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(coloreOggetto),
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
  let emotionTotale = new THREE.Mesh(gTotale, matTotale);
  emotionTotale.position.set(0,600,0);
  scene.add(emotionTotale);

  // ----------------------------------------------------
  //  GRUPPO EMOZIONI (PER OGNI IMMAGINE)
  // ----------------------------------------------------
  let emotionGroup = new THREE.Group();

  const emozioni = _.map(choose, (v,k) => {

    const formeGeometriche = {
      'sfera':      new THREE.SphereGeometry( 0.8, 16, 16 ),
      'piramide':   new THREE.ConeGeometry( 1, 2, 4 ),      
      'cubo':       new THREE.BoxGeometry( 1.2, 1.2, 1.2 ),
      'dodecaedro': new THREE.DodecahedronGeometry( 1, 0 ),
      'octaedro':   new THREE.OctahedronGeometry( 1, 1 )
    };

    const nomiFormeGeometriche = ['dodecaedro','sfera','cubo','piramide'];

    // Colore principale della slide (seconda scelta, se presente)
    const colorePrincipale = v[1] 
      ? new THREE.Color(v[1]).getHexString().toUpperCase() 
      : null;

    let forma;

    if (colorePrincipale) {
      for (let i = 0; i < gruppiColori.length; i++) {
        if (gruppiColori[i].includes(colorePrincipale)) {
          forma = formeGeometriche[nomiFormeGeometriche[i]];
          break; 
        }
      }
    }

    if (!forma) {
      forma = formeGeometriche['octaedro'];
    }

    // MATERIAL EMOZIONI
    const emoMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(v[1] || v[0] || '#FFFFFF'),
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

    // EMOTION 1
    const emotion1 = new THREE.Mesh(forma, emoMaterial);  
    emotion1.position.set(-7.1,13.5,-0.3);
    emotion1.rotation.set(0, Math.PI/4, 0);
    emotion1.scale.set(1.5,1.5,1.5);    
    emotion1.castShadow = true; 
    emotion1.receiveShadow = true;    

    // EMOTION 2
    let newMat = emoMaterial.clone();
    newMat.color = new THREE.Color(v[2] ? v[2] : v[0] || '#FFFFFF');

    let forma2;
    if (v[2]) {
      const coloreCorrente2 = newMat.color.getHexString().toUpperCase();
      for (let i = 0; i < gruppiColori.length; i++) {
        if (gruppiColori[i].includes(coloreCorrente2)) {
          forma2 = formeGeometriche[nomiFormeGeometriche[i]];    
          break; 
        }
      }
    }
    if (!forma2) {
      forma2 = formeGeometriche['octaedro'];
    }

    const emotion2 = new THREE.Mesh(forma2, newMat);  
    emotion2.position.set(-7.9,11.25,-0.3);
    emotion2.rotation.set(Math.PI/4, 0, Math.PI/2);
    emotion2.scale.set(1,1,1);    
    emotion2.castShadow = true; 
    emotion2.receiveShadow = true;   

    // EMOTION 3 
    newMat = emoMaterial.clone();
    newMat.color = new THREE.Color(v[3] ? v[3] : v[0] || '#FFFFFF');

    let forma3;
    if (v[3]) {
      const coloreCorrente3 = newMat.color.getHexString().toUpperCase();
      for (let i = 0; i < gruppiColori.length; i++) {
        if (gruppiColori[i].includes(coloreCorrente3)) {
          forma3 = formeGeometriche[nomiFormeGeometriche[i]]; 
          break;
        }
      }
    }
    if (!forma3) {
      forma3 = formeGeometriche['octaedro'];
    }

    const emotion3 = new THREE.Mesh(forma3, newMat);  
    emotion3.position.set(-6.1,11.5,-0.3);
    emotion3.rotation.set(Math.PI/4, 0, Math.PI/-2);
    emotion3.scale.set(0.7,0.7,0.7); 
    emotion3.castShadow = true; 
    emotion3.receiveShadow = true;    

    const ret = emotionGroup.clone(true);
    ret.add(emotion1, emotion2, emotion3);
    ret.scale.set(20,20,20);
    ret.position.set(40,(k*50)-240,-70);
    ret.rotation.set(
      0,
      k*Math.PI/-16,
      k*Math.PI/-16,
    );

    const numCopies = 12;
    const raggio = 200;
    for (let i = 0; i < numCopies; i++) {
      const clone = ret.clone(true);
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
          node.material.opacity = 1;
        }
      });
      // se vuoi aggiungere i cloni: scene.add(clone);
    }

    scene.add(ret);//Immagine Principale
    allRet.push(ret);

    // ret.userData.isInnerGroup = true;

    emotion1.userData.isInner = true;
    emotion2.userData.isInner = true;
    emotion3.userData.isInner = true;


  });  

  ////// AMBIENTE GLTF ////////////////////// 
  let PSy = -100;
    
  const loaderPlanet = new GLTFLoader();
  loaderPlanet.load('3d/heart/CV_Heart_Cupola_.glb', (gltf) => {
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
  });

  ////////// AUDIO DI BACKGROUND ///////
  const listenerBcg = new THREE.AudioListener();
  camera.add(listenerBcg);
  const audioLoader = new THREE.AudioLoader();

  const backgroundSound = new THREE.Audio(listenerBcg);
  const leavesSound = new THREE.Audio(listenerBcg);

  audioLoader.load('audio/hearts/leaves_rev.wav', (buffer) => {
    leavesSound.setBuffer(buffer);
    leavesSound.setLoop(true);
    leavesSound.setVolume(0.15);
    leavesSound.play();
  });

  const audioToggleButton = document.getElementById('audio-toggle-button');
  const muteIcon = document.getElementById('mute-icon');
  const audioIcon = document.getElementById('audio-icon');

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

  audioLoader.load('audio/hearts/deep-meditation-192828.mp3', (buffer) => {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.1);
    backgroundSound.play();
  });

  if (audioToggleButton) {
    audioToggleButton.addEventListener('click', () => {
      if (isPlaying) {
        backgroundSound.pause();
        leavesSound.pause();
      } else {
        backgroundSound.play();
        leavesSound.play();
      }
      isPlaying = !isPlaying;
      syncIcons();
    });
  } else {
    console.warn('audio-toggle-button non trovato');
  } 
  
  // ANIMATE SCENE ////// 
  function animateScene() {
    requestAnimationFrame(animateScene);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
      // ANIMAZIONE RET – solo il gruppo interno di emotion1–2–3
      const t = clock.elapsedTime;

        scene.traverse(node => {
          if (node.userData.isInner === true) {               
            // node.rotation.y = t * 1.2;
            // Pulsazione leggera
            // const s = 1 + Math.sin(t * 4.0) * 0.15;
            // node.scale.set(s, s, s);
            // Oscillazione
            if (node.userData.baseY === undefined) {
              node.userData.baseY = node.position.y;
            }
            // node.position.y = node.userData.baseY +
            // Math.sin(t * 3.0) * 0.1;
          }

                
        });
    renderer.render(scene, camera);
  }
  animateScene();
};