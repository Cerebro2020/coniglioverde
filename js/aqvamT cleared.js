import * as THREE from 'three';
import { OrbitControls } from '../three_class/OrbitControls.js';

const boxSpacingX = 0.042;
let prevY = 0;
let isPaused = false;

export default function () {
  // ====== CANVAS / SCENA / RENDERER ======
  const canvas = document.getElementById('webgl');
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  const loader = new THREE.TextureLoader();
  loader.load('images/bcg/aqvamT_background.jpg', texture => {
    scene.background = texture;
  });

  // ====== CAMERA ======
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  const player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

  camera.position.set(0, 5000, 0);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));
  camera.setFocalLength(35);

  const initialCameraPosition = new THREE.Vector3().copy(camera.position);
  function resetCamera() {
    camera.position.copy(initialCameraPosition);
  }
  window.resetCamera = resetCamera;

  // ====== RENDERER ======
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
    premultipliedAlpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // ====== RESIZE ======
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  // ====== CONTROLLI ======
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);
  controls.minDistance = 0.1;
  controls.maxDistance = 4900;

  // ====== LUCI ======
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  // ====== SPRITE TESTO ======
  function makeTextSprite(message, parameters = {}) {
    const fontSize = parameters.fontSize || 40;
    const fontColor = parameters.color || '#ffffff';
    const fontFace = parameters.font || 'Arial';

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    context.font = `${fontSize}px ${fontFace}`;
    const textWidth = context.measureText(message).width;

    canvas.width = textWidth;
    canvas.height = fontSize * 1.4;

    context.font = `${fontSize}px ${fontFace}`;
    context.fillStyle = fontColor;
    context.fillText(message, 0, fontSize);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width / 10, canvas.height / 10, 1);

    return sprite;
  }

  // ====== CARICAMENTO CSV ======
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './texts/aqvam.csv', true);

  xhr.onload = function () {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;

    const rows = xhr.responseText.split('\n');
    const allCsvRaw = rows.slice(1).map(row => row.split(','));

    const names = allCsvRaw.map(row => row[0]);

    // parsing numerico con fallback 0
    const allCsvData = allCsvRaw.map(row =>
      row.slice(1).map(v => {
        const num = Number(v.trim());
        return isNaN(num) ? 0 : num;
      })
    );

    const boxes1 = [];
    const boxes2 = [];
    const boxes3 = [];

    const prevY1 = [];
    const prevY2 = [];
    const prevY3 = [];

    const labelFollowMap = [];

    // ====== LUNA / CENTRO ======
    const gLuna = new THREE.SphereGeometry(20, 64, 64);
    const mLuna = new THREE.MeshPhysicalMaterial({ color: 0xffffff });

    const mTrans = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0
    });

    const luna = new THREE.Mesh(gLuna, mLuna);
    luna.position.set(0, 400, -700);

    const gCentro = new THREE.SphereGeometry(0.1, 8, 8);
    const centro = new THREE.Mesh(gCentro, mTrans);
    centro.add(luna);
    centro.rotation.set(0, 0, 0);
    scene.add(centro);

    // ====== UTILS ======
    function getPrevArray(boxesArray) {
      if (boxesArray === boxes1) return prevY1;
      if (boxesArray === boxes2) return prevY2;
      return prevY3;
    }

    function computeTargetY(value) {
      let targetY = value;

      if (targetY <= 9) {
        targetY *= 10;
      } else if (targetY <= 99) {
        targetY += 90;
      } else if (targetY <= 999) {
        targetY /= 10;
        targetY += 180;
      } else if (targetY <= 9999) {
        targetY /= 100;
        targetY += 270;
      } else if (targetY <= 99999) {
        targetY /= 1000;
        targetY += 360;
      } else if (targetY <= 99999999) {
        targetY /= 10000;
        targetY += 450;
      }

      return targetY;
    }

    function computeTargetYJump(value) {
      // versione jump: logica originale, non modificata
      let targetY = value;

      if (targetY <= 9) {
        targetY *= 10;
      } else if (targetY <= 99) {
        targetY += 100;
      } else if (targetY <= 999) {
        targetY /= 10;
        targetY += 200;
      } else if (targetY <= 9999) {
        targetY /= 100;
        targetY += 270;
      } else if (targetY <= 99999) {
        targetY /= 1000;
        targetY += 360;
      } else if (targetY <= 99999999) {
        targetY /= 10000;
        targetY += 450;
      }

      return targetY;
    }

    // ====== CREAZIONE BOX SET ======
    function createBoxSet(columnIndex, boxesArray) {
      for (let i = 0; i < allCsvData.length; i++) {
        if (boxesArray === boxes1) prevY1.push(0);
        if (boxesArray === boxes2) prevY2.push(0);
        if (boxesArray === boxes3) prevY3.push(0);

        const gBox = new THREE.SphereGeometry(5, 8, 8);

        let mBoxColor;
        if (boxesArray === boxes1) {
          mBoxColor = 0x2d821c; // verde
        } else if (boxesArray === boxes2) {
          mBoxColor = 0x008ad1; // azzurro
        } else {
          mBoxColor = 0xffffff; // bianco
        }

        const mBox = new THREE.MeshPhysicalMaterial({ color: mBoxColor });

        // Testa
        const box = new THREE.Mesh(gBox, mBox);
        box.position.set(0, -200, -300);

        // Linea centrale testa (boxLine)
        const boxLine = new THREE.Mesh(gBox, mBox);
        boxLine.position.set(0, 0, 0);
        boxLine.scale.set(1.4, 0.1, 0.1);
        scene.add(boxLine);

        // Coda (lunghezza diversa per set 2 e 3)
        let tailLength = 70;
        if (boxesArray === boxes2) tailLength = 60;
        if (boxesArray === boxes3) tailLength = 50;

        const lineG = new THREE.CylinderGeometry(0.1, 3, tailLength, 8, 1);
        const lineVer = new THREE.Mesh(lineG, mBox);
        lineVer.position.set(0, 0, 35);
        lineVer.rotation.set(Math.PI / 2, 0, 0);

        box.add(lineVer, boxLine);
        box.rotation.x = Math.PI / 2;

        // Contenitore trasparente
        const boxTrans = new THREE.Mesh(gBox, mTrans);
        boxTrans.add(box);
        scene.add(boxTrans);

        // ID
        const id = `box-${columnIndex}-${i}`;
        box.userData.id = id;
        boxTrans.userData.id = id;

        // Angolo radiale
        const angle = (i / allCsvData.length) * 2 * Math.PI + columnIndex * 0.05;
        const radius = 100;
        const labelHeight = 50;

        const endX = Math.cos(angle) * radius;
        const endZ = Math.sin(angle) * radius;
        const endY = box.position.y + labelHeight;

        // Linea verso etichetta
        const worldPos = box.getWorldPosition(new THREE.Vector3());
        const points = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(endX - worldPos.x, endY - worldPos.y, endZ - worldPos.z)
        ];

        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(lineGeo, lineMat);
        line.visible = false;
        box.add(line);

        // Etichetta
        const label = makeTextSprite(names[i]);
        label.position.set(endX, endY, endZ);
        scene.add(label);

        labelFollowMap.push({ box, label });
        boxesArray.push(boxTrans);
      }
    }

    // ====== CREAZIONE SET BOXES ======
    createBoxSet(0, boxes1);
    createBoxSet(1, boxes2);
    createBoxSet(2, boxes3);

    // ====== SCALA BOXES (attualmente identità) ======
    function scaleBoxes(boxesArray, sx, sy, sz) {
      boxesArray.forEach(box => box.scale.set(sx, sy, sz));
    }
    scaleBoxes(boxes2, 1, 1, 1);
    scaleBoxes(boxes3, 1, 1, 1);

    // ====== VISIBILITÀ BOXES ======
    let isVisibleBoxes1 = true;
    let isVisibleBoxes2 = true;
    let isVisibleBoxes3 = true;

    function setBoxesVisibility(boxes, isVisible) {
      boxes.forEach(boxTrans => {
        const shouldShow = isVisible && boxTrans.position.y >= 0.999999;
        boxTrans.visible = shouldShow;

        const match = labelFollowMap.find(
          entry => entry.box.userData.id === boxTrans.userData.id
        );
        if (match) match.label.visible = shouldShow;
      });
    }

    function updateVisibility() {
      setBoxesVisibility(boxes1, isVisibleBoxes1);
      setBoxesVisibility(boxes2, isVisibleBoxes2);
      setBoxesVisibility(boxes3, isVisibleBoxes3);
    }

    // ====== BOTTONI VISIBILITÀ ======
    const btnHideBoxes1 = document.getElementById('btn-hide-boxes1');
    const btnHideBoxes2 = document.getElementById('btn-hide-boxes2');
    const btnHideBoxes3 = document.getElementById('btn-hide-boxes3');

    btnHideBoxes1.addEventListener('click', () => {
      isVisibleBoxes1 = !isVisibleBoxes1;
      setBoxesVisibility(boxes1, isVisibleBoxes1);
    });

    btnHideBoxes2.addEventListener('click', () => {
      isVisibleBoxes2 = !isVisibleBoxes2;
      setBoxesVisibility(boxes2, isVisibleBoxes2);
    });

    btnHideBoxes3.addEventListener('click', () => {
      isVisibleBoxes3 = !isVisibleBoxes3;
      setBoxesVisibility(boxes3, isVisibleBoxes3);
    });

    // ====== PAUSA / PLAY ======
    document.getElementById('btn-pause').addEventListener('click', () => {
      document.getElementById('submenu').style.display = 'block';
      document.getElementById('jump-controls').style.display = 'block';
      isPaused = true;
    });

    document.getElementById('btn-play').addEventListener('click', () => {
      document.getElementById('submenu').style.display = 'none';
      document.getElementById('jump-controls').style.display = 'none';
      isPaused = false;
    });

    // ====== JUMP COLONNE ======
    let currentColumn = 0;
    const totalColumns = Math.floor(allCsvData[0].length / 3);
    const rotationPerColumn = (-2 * Math.PI) / totalColumns;
    let currentRotation = 0;
    let targetRotation = rotationPerColumn;

    function updateCenterRotation() {
      centro.rotation.y = targetRotation;
    }

    function animateBoxesImmediately() {
      function animateBoxes(boxesArray, startColumnIndex) {
        const prevYArray = getPrevArray(boxesArray);

        for (let i = 0; i < allCsvData.length; i++) {
          const rawValue = allCsvData[i][startColumnIndex + currentColumn * 3];
          const targetY = computeTargetYJump(rawValue);

          const boxTrans = boxesArray[i];
          boxTrans.position.y = targetY;
          boxTrans.visible = targetY >= 1;

          const targetRY = i * boxSpacingX;
          boxTrans.rotation.y = -targetRY;

          const box = boxTrans.children[0];
          if (!box) continue;

          const currentY = boxTrans.position.y;
          const previousY = prevYArray[i];

          if (previousY === 0 && currentY !== 0) {
            box.rotation.x = Math.PI / 2;
          } else if (currentY > previousY) {
            box.rotation.x = -2;
          } else if (currentY < previousY) {
            box.rotation.x = 0.95;
          } else {
            box.rotation.x = Math.PI / 2;
          }

          const scaleFactor = 0.6;
          box.position.z = -302.5 - targetY * scaleFactor;

          prevYArray[i] = currentY;
        }
      }

      animateBoxes(boxes1, 0);
      animateBoxes(boxes2, 1);
      animateBoxes(boxes3, 2);
    }

    function jumpToNextColumn() {
      currentColumn = (currentColumn + 1) % totalColumns;
      targetRotation = rotationPerColumn * currentColumn;
      animateBoxesImmediately();
      updateCenterRotation();
      updateVisibility();
    }

    function goToPreviousColumn() {
      currentColumn = (currentColumn - 1 + totalColumns) % totalColumns;
      targetRotation = rotationPerColumn * currentColumn;
      animateBoxesImmediately();
      updateCenterRotation();
      updateVisibility();
    }

    document.getElementById('btn-jump-to-column').addEventListener('click', () => {
      if (isPaused) jumpToNextColumn();
    });

    document.getElementById('btn-previous-column').addEventListener('click', () => {
      if (isPaused) goToPreviousColumn();
    });

    // ====== ANIMAZIONE CONTINUA ======
    function animateScene() {
      requestAnimationFrame(animateScene);

      if (allCsvData.length > 0 && !isPaused) {
        function animateBoxes(boxesArray, startColumnIndex) {
          const prevYArray = getPrevArray(boxesArray);

          for (let i = 0; i < allCsvData.length; i++) {
            const rawValue = allCsvData[i][startColumnIndex + currentColumn * 3];
            const targetY = computeTargetY(rawValue);

            const lerpFactor = 0.125 / 2;
            const lerpFactor2 = 0.00008;

            const boxTrans = boxesArray[i];
            const currentYPos = boxTrans.position.y;

            boxTrans.position.y = THREE.MathUtils.lerp(currentYPos, targetY, lerpFactor);

            const targetRY = i * boxSpacingX;
            const currentRY = boxTrans.rotation.y;
            boxTrans.rotation.y = THREE.MathUtils.lerp(-currentRY, -targetRY, 1);

            const box = boxTrans.children[0];
            if (box) {
              const currentYBox = boxTrans.position.y;
              const previousY = prevYArray[i];

              if (currentYBox > previousY) {
                box.rotation.x = -2;
              } else if (currentYBox < previousY) {
                box.rotation.x = 0.95;
              } else {
                box.rotation.x = Math.PI / 2;
              }

              const scaleFactor = 0.6;
              box.position.z = -302.5 - currentYBox * scaleFactor;
              prevYArray[i] = currentYBox;

              prevY = boxTrans.position.y;

              if (currentYBox > prevY) {
                box.rotation.x = THREE.MathUtils.lerp(box.rotation.x, 0.95, lerpFactor);
              } else if (currentYBox < prevY) {
                box.rotation.x = THREE.MathUtils.lerp(box.rotation.x, -2, lerpFactor);
              } else {
                box.rotation.x = THREE.MathUtils.lerp(box.rotation.x, Math.PI / 2, lerpFactor);
              }
            }

            if (boxTrans.position.y < 0.999999) {
              boxTrans.visible = false;
            } else {
              boxTrans.visible = true;
            }

            
            const match = labelFollowMap.find(entry => entry.box === box);
            if (match) {
              match.label.visible = boxTrans.visible;
            }

            if (Math.abs(currentRotation - targetRotation) < 1) {
              if (currentColumn === 0) {
                currentRotation = 0;
              }
              targetRotation = rotationPerColumn * currentColumn;
            }

            currentRotation = THREE.MathUtils.lerp(currentRotation, targetRotation, lerpFactor2);
            centro.rotation.y = currentRotation;

            if (clock.getElapsedTime() > 4) {
              clock.start();
              currentColumn = (currentColumn + 1) % totalColumns;
            }
          }
        }

        animateBoxes(boxes1, 0);
        animateBoxes(boxes2, 1);
        animateBoxes(boxes3, 2);
      }

      // aggiornamento posizioni etichette
      labelFollowMap.forEach(({ box, label }) => {
        const worldPos = new THREE.Vector3();
        box.getWorldPosition(worldPos);
        label.position.set(worldPos.x, worldPos.y + 30, worldPos.z);
      });

      controls.update(clock.getDelta());
      renderer.render(scene, camera);
    }

    animateScene();
  };

  xhr.send();

  // ====== TORUS MISURATORE ======
  const colorTorus = new THREE.Color('#FFFFFF');
  const torusMat = new THREE.MeshPhysicalMaterial({ color: colorTorus });
  const torus1G = new THREE.TorusGeometry(600, 0.9, 128, 128);

  const torusBase = new THREE.Mesh(torus1G, torusMat);
  torusBase.position.set(0, 0, 0);
  torusBase.rotation.set(Math.PI / 2, 0, 0);

  const torusU = torusBase.clone();
  torusU.material = torusBase.material.clone();
  torusU.material.color.set('#0066ff');

  const torusD = torusBase.clone();
  torusD.material = torusBase.material.clone();
  torusD.material.color.set('#00ff95');

  const torusC = torusBase.clone();
  torusC.material = torusBase.material.clone();
  torusC.material.color.set('#09ff00');

  const torusM = torusBase.clone();
  torusM.material = torusBase.material.clone();
  torusM.material.color.set('#f7fa5e');

  const torusDM = torusBase.clone();
  torusDM.material = torusBase.material.clone();
  torusDM.material.color.set('#ff8400');

  const torusCM = torusBase.clone();
  torusCM.material = torusBase.material.clone();
  torusCM.material.color.set('#ff0000');

  const torusMM = torusBase.clone();
  torusMM.material = torusBase.material.clone();
  torusMM.material.color.set('#000000');

  torusU.position.set(0, -490, 0);
  torusD.position.set(0, -400, 0);
  torusC.position.set(0, -310, 0);
  torusM.position.set(0, -220, 0);
  torusDM.position.set(0, -130, 0);
  torusCM.position.set(0, -40, 0);
  torusMM.position.set(0, 50, 0);

  const scalU = 0.51;
  const scalD = 0.6;
  const scalC = 0.69;
  const scalM = 0.78;
  const scalDM = 0.87;
  const scalCM = 0.96;
  const scalMM = 1.015;

  torusU.scale.set(scalU, scalU, scalU);
  torusD.scale.set(scalD, scalD, scalD);
  torusC.scale.set(scalC, scalC, scalC);
  torusM.scale.set(scalM, scalM, scalM);
  torusDM.scale.set(scalDM, scalDM, scalDM);
  torusCM.scale.set(scalCM, scalCM, scalCM);
  torusMM.scale.set(scalMM, scalMM, scalMM);

  const misuratore = new THREE.Group();
  misuratore.add(torusU, torusD, torusC, torusM, torusDM, torusCM, torusMM);
  scene.add(misuratore);
  misuratore.position.set(0, 300, 0);

  const btnQuantity = document.getElementById('btn-quantity');
  btnQuantity.addEventListener('click', () => {
    misuratore.visible = !misuratore.visible;
  });

  // ====== TORUS CONTATORE ======
  const colorsArray2 = [
    '#373737',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000'
  ];

  const decadeMats = [
    torusU.material,
    torusD.material,
    torusC.material,
    torusM.material,
    torusDM.material,
    torusCM.material
  ];

  const counterGroup = new THREE.Group();
  scene.add(counterGroup);

  for (let i = 0; i < 53; i++) {
    const torus2G = new THREE.TorusGeometry(300, 0.25, 128, 128);
    const torus2 = new THREE.Mesh(torus2G);

    const decade = Math.floor(i / 9); // logica originale U/D/C/M/DM/CM (9 per gruppo)
    torus2.material = decadeMats[decade];

    torus2.position.set(0, -189.5 + i * 10, 0);
    torus2.rotation.set(Math.PI / 2, 0, 0);

    const scaleTorus2 = 1.02 + i / 50;
    torus2.scale.set(scaleTorus2, scaleTorus2, 1);

    scene.add(torus2);
    torus2.visible = false;

    const btnCount = document.getElementById('btn-count');
    btnCount.addEventListener('click', () => {
      torus2.visible = !torus2.visible;
    });
  }

  // ====== CALENDAR BOXES ======
  for (let i = 0; i < 12; i++) {
    const gCalendar = new THREE.CylinderGeometry(30, 30, 1, 64, 64);
    const mCalendar = new THREE.MeshPhysicalMaterial({
      color: colorsArray2[i]
    });
    const calendar = new THREE.Mesh(gCalendar, mCalendar);
    scene.add(calendar);
    calendar.position.set(0, 400, -700);

    const gCCalendar = new THREE.BoxGeometry(30, 30, 30);
    const mCCalendar = new THREE.MeshPhysicalMaterial({
      color: 0xff2222,
      transparent: true,
      opacity: 0
    });
    const cCalendar = new THREE.Mesh(gCCalendar, mCCalendar);
    cCalendar.position.set(0, 0, 0);
    cCalendar.add(calendar);
    cCalendar.rotation.set(0, -i / 1.91, 0);
    scene.add(cCalendar);

    const btnCalendar = document.getElementById('btn-calendar');
    btnCalendar.addEventListener('click', () => {
      cCalendar.visible = !cCalendar.visible;
    });
  }

  // ====== BOTTONI CAMERA E PLAY/PAUSE GLOBALI ======
  const btnCameraC = document.getElementById('btn-cameraC');
  btnCameraC.addEventListener('click', () => {
    camera.position.set(0, 500, 0);
  });

  const btnCameraH = document.getElementById('btn-cameraH');
  btnCameraH.addEventListener('click', () => {
    camera.position.set(0, 4000, 0);
  });

  const btnPause = document.getElementById('btn-pause');
  btnPause.addEventListener('click', () => {
    isPaused = true;
  });

  const btnPlay = document.getElementById('btn-play');
  btnPlay.addEventListener('click', () => {
    isPaused = false;
  });
}
