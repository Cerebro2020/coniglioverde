import * as THREE from 'three';
import { OrbitControls } from '../three_class/OrbitControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

export default function (choose, quadri) {
  const isMobile = window.innerWidth < 768;

  // Mantengo variabili “storiche” per compatibilità (non rimosse)
  const colore0 = choose?.[0]?.[0];
  const colore1 = choose?.[0]?.[1];
  const colore2 = choose?.[1]?.[1];
  const colore3 = choose?.[2]?.[1];
  const colore4 = choose?.[3]?.[1];
  const colore5 = choose?.[4]?.[1];
  const colore6 = choose?.[5]?.[1];
  const colore7 = choose?.[6]?.[1];
  const colore8 = choose?.[7]?.[1];
  const colore9 = choose?.[8]?.[1];
  const colore10 = choose?.[9]?.[1];
  const colore11 = choose?.[10]?.[1];
  const colore12 = choose?.[11]?.[1];
  const colore13 = choose?.[12]?.[1];
  const colore14 = choose?.[13]?.[1];
  const colore15 = choose?.[14]?.[1];
  const colore16 = choose?.[15]?.[1];
  const colore17 = choose?.[16]?.[1];
  const colore18 = choose?.[17]?.[1];
  const colore19 = choose?.[18]?.[1];
  const colore20 = choose?.[19]?.[1];

  const innerNodes = [];
  const allRet = [];
  let mixer;

  const clock = new THREE.Clock();

  // SCENE
  const scene = new THREE.Scene();
  scene.position.set(0, -300, 0);

  // BACKGROUND (equirettangolare)
  const bgLoader = new THREE.TextureLoader();
  bgLoader.load('images/equiangular/Space_4.jpg', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  });

  // CAMERA
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000);
  const player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
  camera.position.set(0, 400, -1300);
  camera.lookAt(new THREE.Vector3(0, player.height, 1000));
  camera.setFocalLength(25);

  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !isMobile,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);

  // CONTROLLI
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 35;
  controls.maxDistance = 1900;
  controls.maxPolarAngle = 1.5;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.update();

  // --- LUCI (mancavano) ---
  // Ambient
  const ambient = new THREE.AmbientLight(0xffffff, isMobile ? 0.55 : 0.35);
  scene.add(ambient);

  // Spot 1
  const spotLight = new THREE.SpotLight(0xffffff, isMobile ? 0.9 : 1.1, 5000, Math.PI / 6, 0.35, 1.0);
  spotLight.position.set(400, 1200, -800);
  spotLight.target.position.set(0, 200, 0);
  scene.add(spotLight);
  scene.add(spotLight.target);

  // Spot 2
  const spotLight2 = new THREE.SpotLight(0xffffff, isMobile ? 0.6 : 0.85, 5000, Math.PI / 5, 0.4, 1.0);
  spotLight2.position.set(-800, 900, -200);
  spotLight2.target.position.set(0, 250, 0);
  scene.add(spotLight2);
  scene.add(spotLight2.target);

  // Point lights “di riempimento”
  const pLight = new THREE.PointLight(0xffffff, isMobile ? 0.35 : 0.55, 2200);
  pLight.position.set(600, 300, 300);
  scene.add(pLight);

  const pLight2 = new THREE.PointLight(0xffffff, isMobile ? 0.25 : 0.4, 2200);
  pLight2.position.set(-600, 260, 200);
  scene.add(pLight2);

  const pLight3 = new THREE.PointLight(0xffffff, isMobile ? 0.2 : 0.35, 2200);
  pLight3.position.set(0, 160, -900);
  scene.add(pLight3);

  const pLight4 = new THREE.PointLight(0xffffff, isMobile ? 0.2 : 0.35, 2200);
  pLight4.position.set(0, 900, 200);
  scene.add(pLight4);

  // Ombre: abilitate solo desktop, e set mapSize coerente
  const shadowMapSize = isMobile ? 0 : 1024;
  const enableShadow = !isMobile;

  spotLight.castShadow = enableShadow;
  spotLight2.castShadow = enableShadow;
  pLight.castShadow = enableShadow;
  pLight2.castShadow = enableShadow;
  pLight3.castShadow = enableShadow;
  pLight4.castShadow = enableShadow;

  if (enableShadow) {
    spotLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    spotLight2.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    pLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    pLight2.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    pLight3.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    pLight4.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  }

  // ----------------------------------------------------
  // COLORE DOMINANTE (UNA SOLA VOLTA)
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

  function calcolaColoreDominante(chooseArr, gruppi) {
    const conteggioAree = [0, 0, 0, 0];
    if (!chooseArr) return '#FFFFFF';

    for (let quad in chooseArr) {
      const v = chooseArr[quad];
      if (!v || v.length < 2) continue;

      const c = v[1];
      if (!c || c === '#FFFFFF') continue;

      const hex = new THREE.Color(c).getHexString().toUpperCase();
      let indiceArea;
      for (let i = 0; i < gruppi.length; i++) {
        if (gruppi[i].includes(hex)) {
          indiceArea = i;
          break;
        }
      }
      if (indiceArea !== undefined) conteggioAree[indiceArea]++;
    }

    const maxConteggio = Math.max(...conteggioAree);
    if (maxConteggio === 0) return '#FFFFFF';

    const nMax = conteggioAree.filter(v => v === maxConteggio).length;
    if (nMax > 1) return '#777777';

    const areaPiuScelta = conteggioAree.indexOf(maxConteggio);
    const mappaColori = {
      0: '#fff200',
      1: '#ff0000',
      2: '#007afd',
      3: '#50fd00'
    };
    return mappaColori[areaPiuScelta] || '#FFFFFF';
  }

  const coloreOggetto = calcolaColoreDominante(choose, gruppiColori);

  function makeMaterial(color) {
    const params = {
      color: new THREE.Color(color || '#FFFFFF'),
      metalness: 0.5,
      roughness: 0,
      transparent: true,
      opacity: 1,
    };
    return isMobile
      ? new THREE.MeshStandardMaterial(params)
      : new THREE.MeshPhysicalMaterial(params);
  }

  // SFERA “TOTALE”
  const gTotale = new THREE.SphereGeometry(100, 16, 16);
  const matTotale = makeMaterial(coloreOggetto);
  const emotionTotale = new THREE.Mesh(gTotale, matTotale);
  emotionTotale.position.set(0, 600, 0);
  emotionTotale.castShadow = !isMobile;
  emotionTotale.receiveShadow = !isMobile;
  scene.add(emotionTotale);

  // ----------------------------------------------------
  // EMOZIONI (PER OGNI IMMAGINE)
  // ----------------------------------------------------
  const emotionGroup = new THREE.Group();

  // Presuppone lodash "_" come nel tuo progetto originale
  _.map(choose, (v, k) => {
    const formeGeometriche = {
      sfera: new THREE.SphereGeometry(0.8, 16, 16),
      piramide: new THREE.ConeGeometry(1, 2, 4),
      cubo: new THREE.BoxGeometry(1.2, 1.2, 1.2),
      dodecaedro: new THREE.DodecahedronGeometry(1, 0),
      octaedro: new THREE.OctahedronGeometry(1, 1),
    };

    const nomiFormeGeometriche = ['dodecaedro', 'sfera', 'cubo', 'piramide'];

    const colorePrincipale = v?.[1]
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
    if (!forma) forma = formeGeometriche.octaedro;

    const emoMaterial = makeMaterial(v?.[1] || v?.[0] || '#FFFFFF');

    // EMOTION 1
    const emotion1 = new THREE.Mesh(forma, emoMaterial);
    emotion1.position.set(-7.1, 13.5, -0.3);
    emotion1.rotation.set(0, Math.PI / 4, 0);
    emotion1.scale.set(1.5, 1.5, 1.5);
    emotion1.castShadow = !isMobile;
    emotion1.receiveShadow = !isMobile;

    // EMOTION 2
    let newMat = emoMaterial.clone();
    newMat.color = new THREE.Color(v?.[2] ? v[2] : (v?.[0] || '#FFFFFF'));

    let forma2;
    if (v?.[2]) {
      const coloreCorrente2 = newMat.color.getHexString().toUpperCase();
      for (let i = 0; i < gruppiColori.length; i++) {
        if (gruppiColori[i].includes(coloreCorrente2)) {
          forma2 = formeGeometriche[nomiFormeGeometriche[i]];
          break;
        }
      }
    }
    if (!forma2) forma2 = formeGeometriche.octaedro;

    const emotion2 = new THREE.Mesh(forma2, newMat);
    emotion2.position.set(-7.9, 11.25, -0.3);
    emotion2.rotation.set(Math.PI / 4, 0, Math.PI / 2);
    emotion2.scale.set(1, 1, 1);
    emotion2.castShadow = !isMobile;
    emotion2.receiveShadow = !isMobile;

    // EMOTION 3
    newMat = emoMaterial.clone();
    newMat.color = new THREE.Color(v?.[3] ? v[3] : (v?.[0] || '#FFFFFF'));

    let forma3;
    if (v?.[3]) {
      const coloreCorrente3 = newMat.color.getHexString().toUpperCase();
      for (let i = 0; i < gruppiColori.length; i++) {
        if (gruppiColori[i].includes(coloreCorrente3)) {
          forma3 = formeGeometriche[nomiFormeGeometriche[i]];
          break;
        }
      }
    }
    if (!forma3) forma3 = formeGeometriche.octaedro;

    const emotion3 = new THREE.Mesh(forma3, newMat);
    emotion3.position.set(-6.1, 11.5, -0.3);
    emotion3.rotation.set(Math.PI / 4, 0, Math.PI / -2);
    emotion3.scale.set(0.7, 0.7, 0.7);
    emotion3.castShadow = !isMobile;
    emotion3.receiveShadow = !isMobile;

    const ret = emotionGroup.clone(true);
    ret.add(emotion1, emotion2, emotion3);
    ret.scale.set(20, 20, 20);
    ret.position.set(40, (k * 50) - 240, -70);
    ret.rotation.set(0, k * Math.PI / -16, k * Math.PI / -16);

    scene.add(ret);
    allRet.push(ret);

    // marcatura interna + lista per eventuali animazioni leggere
    emotion1.userData.isInner = true;
    emotion2.userData.isInner = true;
    emotion3.userData.isInner = true;
    innerNodes.push(emotion1, emotion2, emotion3);
  });

  // AMBIENTE GLTF
  const PSy = -100;
  const loaderPlanet = new GLTFLoader();
  loaderPlanet.load('3d/heart/CV_Heart_Cupola_2.glb', (gltf) => {
    const model = gltf.scene;
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = !isMobile;
        node.receiveShadow = !isMobile;
        node.material.side = THREE.DoubleSide;
      }
    });
    model.position.set(0, PSy, 0);
    model.rotation.set(0, Math.PI / 28.5, 0);
    const scala = 400;
    model.scale.set(scala, scala, scala);
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations?.forEach((clip) => mixer.clipAction(clip).play());
  });

  // AUDIO
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

  // ANIMATE
  function animateScene() {
    requestAnimationFrame(animateScene);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // qui puoi (se vuoi) riattivare micro-animazioni sugli innerNodes
    // const t = clock.elapsedTime;
    for (const node of innerNodes) {
      if (node.userData.baseY === undefined) node.userData.baseY = node.position.y;
      // node.position.y = node.userData.baseY + Math.sin(t * 3.0) * 0.1;
    }

    renderer.render(scene, camera);
  }
  animateScene();
}