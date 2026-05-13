import * as THREE from 'three';
import { PointerLockControls } from '../three_class/PointerLockControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';
import { EffectComposer } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function(choose, quadri){  

  let allRet = [];
  const clock = new THREE.Clock();
  let mixer;

  // ----------------------------------------------------
  //  SCENE / ATMOSFERA
  // ----------------------------------------------------

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050512, 0.00022);

  const loader2 = new THREE.TextureLoader();
  loader2.load('images/equiangular/Esky2.png', texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });

  // ----------------------------------------------------
  //  CAMERA
  // ----------------------------------------------------

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };  
  camera.position.set(0, player.height, -1800);
  camera.rotation.set(0,0,0);
  camera.lookAt(new THREE.Vector3(0, player.height, 1000)); 
  camera.setFocalLength(15);
  
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  };

  // ----------------------------------------------------
  //  VIDEO TEXTURE PER LA PISCINA
  // ----------------------------------------------------
  
  const video = document.createElement('video');
  video.src = 'video/video_textures/water_loop.mp4';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.style.display = 'none';
  document.body.appendChild(video);
  video.load();
  video.play().catch(() => {
    console.warn('Il video verrà avviato al primo gesto utente.');
  });

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;
  videoTexture.format = THREE.RGBAFormat;

  // ----------------------------------------------------
  //  CONTROLLI TASTIERA
  // ----------------------------------------------------

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
      case 'ShiftLeft': move.down = false; break;
    }
  }); 

  // ----------------------------------------------------
  //  RENDERER
  // ----------------------------------------------------

  const renderer = new THREE.WebGLRenderer({
    alpha:true, 
    antialias:true,
    powerPreference: 'high-performance'
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  document.body.appendChild(renderer.domElement); 
  renderer.xr.enabled = true;

  const controls = new PointerLockControls(camera, document.body); 

  controls.addEventListener('lock', () => {
    console.log('Controllo attivato');
  });

  controls.addEventListener('unlock', () => {
    console.log('Controllo disattivato');
  });
  
  renderer.domElement.addEventListener('click', () => {
    if (!controls.isLocked) controls.lock();
    if (video.paused) video.play().catch(() => {});
  });

  // ----------------------------------------------------
  //  POST-PROCESSING
  // ----------------------------------------------------

  const composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.55,
    0.45,
    0.78
  );
  composer.addPass(bloomPass);

  const bokehPass = new BokehPass(scene, camera, {
    focus: 1200,
    aperture: 0.0000035,
    maxblur: 0.0018
  });
  composer.addPass(bokehPass);
    
  window.addEventListener('resize', function(){
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    composer.setSize(width, height);
    bloomPass.setSize(width, height);
  }); 

  // ----------------------------------------------------
  //  LIGHTS
  // ----------------------------------------------------

  const ambient = new THREE.AmbientLight(0xFFFFFF, 0.35);   
  scene.add(ambient);

  const mainSpot = new THREE.SpotLight(0xffffff, 5.5);
  mainSpot.position.set(1000, 2500, 0);
  mainSpot.angle = Math.PI / 3;
  mainSpot.penumbra = 0.85;
  mainSpot.decay = 2;
  mainSpot.distance = 9500;
  mainSpot.castShadow = true;
  mainSpot.shadow.mapSize.width = 4096;
  mainSpot.shadow.mapSize.height = 4096;
  mainSpot.shadow.radius = 6;
  mainSpot.shadow.camera.near = 0.1; 
  mainSpot.shadow.camera.far = 10000;
  mainSpot.shadow.bias = -0.0004;
  scene.add(mainSpot);
  
  const rimLightBlue = new THREE.PointLight(0x1b64ff, 4.8, 7000, 2);
  rimLightBlue.position.set(-1200, 800, -1200);
  scene.add(rimLightBlue);

  const rimLightRed = new THREE.PointLight(0xff1f5a, 3.5, 6500, 2);
  rimLightRed.position.set(1400, 650, 900);
  scene.add(rimLightRed);

  const lowGreenLight = new THREE.PointLight(0x48ff7a, 1.6, 4500, 2);
  lowGreenLight.position.set(0, -500, 1000);
  scene.add(lowGreenLight);

  // ----------------------------------------------------
  //  TEXTURES
  // ----------------------------------------------------

  const loader = new THREE.TextureLoader();
  let skin = loader.load('images/textures/marble_2.png');
  skin.wrapS = THREE.RepeatWrapping;
  skin.wrapT = THREE.RepeatWrapping;
  skin.repeat.set(8,8);
  skin.colorSpace = THREE.SRGBColorSpace;

  let skin2 = loader.load('images/textures/Bronze.jpg');
  skin2.colorSpace = THREE.SRGBColorSpace;

  let skin2Trans = loader.load('images/textures/skin2T.png');
  skin2Trans.colorSpace = THREE.NoColorSpace;

  let skin3 = loader.load('images/textures/moon.jpg');
  skin3.colorSpace = THREE.SRGBColorSpace;

  // ----------------------------------------------------
  //  PARTICELLE ATMOSFERICHE
  // ----------------------------------------------------

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1800;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2600;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4200;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.2,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // ----------------------------------------------------
  //  CALCOLO COLORE DOMINANTE
  // ----------------------------------------------------

  const colori = [
    'DEC414', 'FEF600', 'FFD700', 'C9A021',
    'FE005B', 'FF0000', 'A32590', 'DF73FF',
    '227BFF', '222EFF', '001DEC', '2A23A3',
    '49C51A', '2D7121', '3C6232', '008000',
  ];

  const gruppiColori = [
    colori.slice(0, 4),
    colori.slice(4, 8),
    colori.slice(8, 12),
    colori.slice(12, 16)
  ];

  function calcolaColoreDominante(choose, gruppiColori) {
    let conteggioAree = [0, 0, 0, 0];

    for (let quad in choose) {
      const v = choose[quad];
      if (!v || v.length < 2) continue;

      for (let j = 1; j < Math.min(v.length, 4); j++) {
        const c = v[j];
        if (!c || c === '#FFFFFF') continue;

        const hex = new THREE.Color(c).getHexString().toUpperCase();
        let indiceArea;

        for (let i = 0; i < gruppiColori.length; i++) {
          if (gruppiColori[i].includes(hex)) {
            indiceArea = i;
            break;
          }
        }

        if (indiceArea !== undefined) conteggioAree[indiceArea]++;
      }
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
  console.log('Colore dominante finale:', coloreOggetto);

  // ----------------------------------------------------
  //  SFERA GLOBALE
  // ----------------------------------------------------

  let gTotale = new THREE.SphereGeometry(600, 96, 96);
  let matTotale = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(coloreOggetto),
    emissive: new THREE.Color(coloreOggetto),
    emissiveIntensity: 0.08,
    roughness: 0.28,
    metalness: 0.05,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
    transparent: true,
    opacity: 0.92
  });

  let emotionTotale = new THREE.Mesh(gTotale, matTotale);
  emotionTotale.position.set(1000, 2400, 0);
  emotionTotale.castShadow = true;
  emotionTotale.receiveShadow = true;
  scene.add(emotionTotale);

  const auraTotale = new THREE.Mesh(
    new THREE.SphereGeometry(630, 64, 64),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(coloreOggetto),
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
  );
  auraTotale.position.copy(emotionTotale.position);
  scene.add(auraTotale);

  // ----------------------------------------------------
  //  MATERIALI EMOZIONI
  // ----------------------------------------------------

  function createEmotionMaterial(colorValue) {
    const color = new THREE.Color(colorValue || '#FFFFFF');
    return new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.13,
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.08,
      ior: 1.35
    });
  }

  function addSmallAura(mesh, colorValue, scale = 1.45) {
    const aura = new THREE.Mesh(
      mesh.geometry.clone(),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorValue || '#FFFFFF'),
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      })
    );
    aura.scale.set(scale, scale, scale);
    mesh.add(aura);
  }

  function getFormaDaColore(colore, formeGeometriche, nomiFormeGeometriche) {
    if (!colore) return formeGeometriche.octaedro;

    const hex = new THREE.Color(colore).getHexString().toUpperCase();

    for (let i = 0; i < gruppiColori.length; i++) {
      if (gruppiColori[i].includes(hex)) {
        return formeGeometriche[nomiFormeGeometriche[i]];
      }
    }

    return formeGeometriche.octaedro;
  }

  // ----------------------------------------------------
  //  GRUPPO EMOZIONI
  // ----------------------------------------------------

  let emotionGroup = new THREE.Group();

  _.map(choose, (v,k) => {

    const formeGeometriche = {
      sfera:      new THREE.SphereGeometry(0.8, 32, 32),
      piramide:   new THREE.ConeGeometry(1, 2, 4),      
      cubo:       new THREE.BoxGeometry(1.2, 1.2, 1.2),
      dodecaedro: new THREE.DodecahedronGeometry(1, 0),
      octaedro:   new THREE.OctahedronGeometry(1, 1)
    };

    const nomiFormeGeometriche = ['dodecaedro','sfera','cubo','piramide'];

    const colore1 = v[1] || v[0] || '#FFFFFF';
    const forma = getFormaDaColore(colore1, formeGeometriche, nomiFormeGeometriche);

    const emoMaterial = createEmotionMaterial(colore1);

    // EMOTION 1
    const emotion1 = new THREE.Mesh(forma, emoMaterial);
    emotion1.position.set(-7.1, 13.5, -0.3);
    emotion1.rotation.set(0, 0, 0);
    emotion1.scale.set(1.5, 1.5, 1.5);
    emotion1.castShadow = true;
    emotion1.receiveShadow = true;
    emotion1.userData.baseScale = 1.5;
    emotion1.userData.phase = Math.random() * Math.PI * 2;
    addSmallAura(emotion1, colore1, 1.35);

    const geometry = new THREE.CylinderGeometry(0.08, 0.12, 6, 32);
    const material = createEmotionMaterial(colore1);
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(0, -4, 0);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    emotion1.add(cylinder);

    // EMOTION 2
    let emotion2 = null;

    if (v[2]) {
      const forma2 = getFormaDaColore(v[2], formeGeometriche, nomiFormeGeometriche);
      const mat2 = createEmotionMaterial(v[2]);

      emotion2 = new THREE.Mesh(forma2, mat2);
      emotion2.position.set(-7.9, 11.25, -0.3);
      emotion2.rotation.set(Math.PI / 4, 0, Math.PI / 2);
      emotion2.scale.set(1, 1, 1);
      emotion2.castShadow = true;
      emotion2.receiveShadow = true;
      emotion2.userData.baseScale = 1;
      emotion2.userData.phase = Math.random() * Math.PI * 2;
      addSmallAura(emotion2, v[2], 1.35);
    }

    // EMOTION 3
    let emotion3 = null;

    if (v[3]) {
      const forma3 = getFormaDaColore(v[3], formeGeometriche, nomiFormeGeometriche);
      const mat3 = createEmotionMaterial(v[3]);

      emotion3 = new THREE.Mesh(forma3, mat3);
      emotion3.position.set(-6.1, 11.5, -0.3);
      emotion3.rotation.set(Math.PI / 4, 0, Math.PI / -2);
      emotion3.scale.set(0.7, 0.7, 0.7);
      emotion3.castShadow = true;
      emotion3.receiveShadow = true;
      emotion3.userData.baseScale = 0.7;
      emotion3.userData.phase = Math.random() * Math.PI * 2;
      addSmallAura(emotion3, v[3], 1.35);
    }

    const ret = emotionGroup.clone(true);
    ret.add(emotion1);

    if (emotion2) ret.add(emotion2);
    if (emotion3) ret.add(emotion3);

    const sRet = 30;
    ret.scale.set(sRet, sRet, sRet);

    // Disposizione più profonda e meno piatta: spirale verticale nello spazio.
    const index = Number(k);
    const angle = index * 0.42;
    const radius = 60 + index * 8;

    ret.position.set(
      Math.cos(angle) * radius,
      (index * 100) + 0,
      Math.sin(angle) * radius + 100
    );

    ret.rotation.set(
      index * Math.PI / -18,
      -angle + Math.PI / 2,
      index * Math.PI / -22
    );

    ret.userData.baseY = ret.position.y;
    ret.userData.phase = Math.random() * Math.PI * 2;
    ret.userData.speed = 0.65 + Math.random() * 0.35;

    scene.add(ret);
    allRet.push(ret);

    emotion1.userData.isInner = true;
    if (emotion2) emotion2.userData.isInner = true;
    if (emotion3) emotion3.userData.isInner = true;
  });  

  // ----------------------------------------------------
  //  AMBIENTE GLTF
  // ----------------------------------------------------

  let PSy = -100;
  const loaderSala = new GLTFLoader();

  loaderSala.load('3d/heart/CV_Heart_Cupola_2.glb', (gltf) => {
    const model = gltf.scene;

    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        if (node.material) {
          const oldMat = node.material;
          node.material = new THREE.MeshPhysicalMaterial({
            map: oldMat.map || null,
            color: oldMat.color || new THREE.Color(0xffffff),
            roughness: 0.62,
            metalness: 0.06,
            clearcoat: 0.18,
            clearcoatRoughness: 0.35,
            side: THREE.DoubleSide
          });
        }
      }
    });

    model.position.set(0, PSy, 0);
    model.rotation.set(0, -Math.PI / 2, 0);

    const scala = 400;
    model.scale.set(scala, scala, scala);

    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  });

  // ----------------------------------------------------
  //  AUDIO
  // ----------------------------------------------------

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

  audioLoader.load('audio/hearts/Neither_Sweat_Nor_Tears.mp3', (buffer) => {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.2);
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
  
  // ----------------------------------------------------
  //  ANIMATE SCENE
  // ----------------------------------------------------

  function animateScene() {
    requestAnimationFrame(animateScene);

    const delta = clock.getDelta();
    const t = clock.elapsedTime;

    if (mixer) mixer.update(delta);

    velocity.x -= velocity.x * 5 * delta;
    velocity.z -= velocity.z * 5 * delta;

    direction.z = Number(move.forward) - Number(move.backward);
    direction.x = Number(move.right) - Number(move.left);
    direction.normalize();

    if (move.forward || move.backward) velocity.z -= direction.z * 1000 * delta;
    if (move.left || move.right) velocity.x -= direction.x * 1000 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    if (move.up) controls.getObject().position.y += 100 * delta;

    const floorHeight = 1.8;

    if (move.down) {
      if (controls.getObject().position.y > floorHeight) {
        controls.getObject().position.y -= 100 * delta;
        if (controls.getObject().position.y < floorHeight) {
          controls.getObject().position.y = floorHeight;
        }
      }    
    } 

    // Animazione dei gruppi principali.
    allRet.forEach((ret, index) => {
      ret.position.y = ret.userData.baseY + Math.sin(t * ret.userData.speed + ret.userData.phase) * 12;
      ret.rotation.y += 0.0012;
      ret.rotation.z += Math.sin(t * 0.6 + index) * 0.0009;

      ret.traverse(node => {
        if (node.userData.isInner === true) {
          node.rotation.x += 0.006;
          node.rotation.y += 0.009;

          const base = node.userData.baseScale || 1;
          const s = base + Math.sin(t * 2.6 + node.userData.phase) * 0.05;
          node.scale.set(s, s, s);
        }
      });
    });

    // Sfera globale.
    const s = 1.0 + Math.sin(t * 1.5) * 0.035;
    emotionTotale.scale.set(s, s, s);
    emotionTotale.rotation.y = t * 0.05;
    auraTotale.scale.set(1 + Math.sin(t * 1.2) * 0.035, 1 + Math.sin(t * 1.2) * 0.035, 1 + Math.sin(t * 1.2) * 0.035);

    // Particelle.
    particles.rotation.y = t * 0.006;
    particles.rotation.x = Math.sin(t * 0.15) * 0.02;

    composer.render();
  }

  animateScene();
};