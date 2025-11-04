import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';

const boxSpacingX = 0.042;
let prevY = 0;
let isPaused = false;

export default function(){ 

  const canvas = document.getElementById('webgl');
  const isMobile = /Android|iP(ad|hone|od)/i.test(navigator.userAgent);  
  const clock = new THREE.Clock(); 
  window.resetCamera = resetCamera;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);
  // ====== CAMERA  ======
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
  // ====== RENDERER ======
  const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,//chiedi MSAA
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      premultipliedAlpha: true
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  // ====== RESIZE ======
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }); 
  // ====== CAMERA ======
  camera.position.set( 0, 3900, 0 );
  camera.lookAt(new THREE.Vector3( 0, player.height, 0));
  camera.setFocalLength ( 35 );
  let initialCameraPosition = new THREE.Vector3();
  initialCameraPosition.copy(camera.position);
  function resetCamera() {
    camera.position.copy(initialCameraPosition);
  }
  // ====== CONTROLS ======
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.listenToKeyEvents(window);
  controls.minDistance =  0.1;    
  controls.maxDistance = 3900;
  // ====== LIGHTS ======
  const ambiente = new THREE.AmbientLight ( 0xffffff, 1.5 );  
  scene.add( ambiente);
  // ====== XHR ======
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './texts/aqvam.csv', true);
  xhr.onload = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let rows = xhr.responseText.split('\n');
      let allCsvData = rows.slice(1).map(row => row.split(',').map(Number));
      let boxes1 = [];
      let boxes2 = [];
      let boxes3 = [];

      let prevY1 = [];
      let prevY2 = [];
      let prevY3 = [];
      // ====== LUNA ======
      let gLuna = new THREE.SphereGeometry(20,64,64);
      let mLuna = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
      });
      // ====== MATERIAL ======
      const mTrans = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0,
      });
      // luna con centro
      let luna = new THREE.Mesh(gLuna, mLuna);
      luna.position.set(0, 400, -700);
      let gCentro = new THREE.SphereGeometry(0.1,8,8);
      let centro = new THREE.Mesh(gCentro, mTrans); // Centro
      centro.add(luna);
      centro.rotation.set(0, 0, 0);
      scene.add(centro);       
      // ====== CREA BOX ====== 
      function createBoxSet(columnIndex, boxesArray) {
        for (let i = 0; i < allCsvData.length; i++) {
          if (boxesArray === boxes1) prevY1.push(0);
          if (boxesArray === boxes2) prevY2.push(0);
          if (boxesArray === boxes3) prevY3.push(0);
          const xOffset = columnIndex * 0;//offset
          let color;                 
          const gBox = new THREE.SphereGeometry(5,8,8);
          let mBoxColor = color !== undefined ? color : (columnIndex === 2 ?  0x008AD1 : (columnIndex === 3 ? 0xffffff : 0x2D821C));
          const mBox = new THREE.MeshPhysicalMaterial({
            color: mBoxColor,
            //flatShading: true,
          });
          // ====== TESTA ======
          let box = new THREE.Mesh(gBox, mBox);
          box.position.set(0, -200, -300);
          // ====== LINA TESTA ======
          let boxLine = new THREE.Mesh(gBox, mBox); // centro
          boxLine.position.set(0, 0, 0);
          boxLine.scale.set(1.4, 0.1, 0.1);
          scene.add(boxLine);
          let lineG = new THREE.CylinderGeometry(0.1,3,70,8,1);
          let lineVer = new THREE.Mesh(lineG, mBox);
          // ====== CODA ======
          lineVer.position.set(0, 0, 35);
          lineVer.rotation.set(Math.PI / 2, 0, 0);
          box.add(lineVer, boxLine);
          box.rotation.x = Math.PI / 2;               
          // ====== centro trasparente
          let boxTrans = new THREE.Mesh(gBox, mTrans);
          boxTrans.position.z += xOffset;                    
          boxTrans.add(box);
          scene.add(boxTrans);
          boxesArray.push(boxTrans);
        }
      }
      // Create boxes for the first, second, and third column sets     
      createBoxSet(1, boxes1 );
      createBoxSet(2, boxes2 );
      createBoxSet(3, boxes3 );
      // Function to scale the boxes in the boxes1 array
      function scaleBoxes(boxesArray, scaleX, scaleY, scaleZ) {
        boxesArray.forEach(box => {
          box.scale.set(scaleX, scaleY, scaleZ);
        });
      }
      // Scale the boxes1 array
      scaleBoxes(boxes2,0.98, 1,0.98); 
      scaleBoxes(boxes3,0.97, 1,0.97);      
      // ====== FUNZIONI BUTTON ======
      document.getElementById('btn-pause').addEventListener('click', function() {
        document.getElementById('submenu').style.display = 'block';
        document.getElementById('jump-controls').style.display = 'block';       
      });
      document.getElementById('btn-play').addEventListener('click', function() {
        document.getElementById('submenu').style.display = 'none';
        document.getElementById('jump-controls').style.display = 'none';
      });
      let isVisibleBoxes1 = true;
      let isVisibleBoxes2 = true;
      let isVisibleBoxes3 = true;
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
      function setBoxesVisibility(boxes, isVisible) {
        boxes.forEach(box => {
          box.visible = isVisible;
          if (box.position.y < 0.999999) {
            box.visible = false;
          }
        });
      }
      // Ensure the boxes' visibility is respected during jump or previous actions
      function updateVisibility() {
        setBoxesVisibility(boxes1, isVisibleBoxes1);
        setBoxesVisibility(boxes2, isVisibleBoxes2);
        setBoxesVisibility(boxes3, isVisibleBoxes3);
      }
      // ====== JUMP
      document.getElementById('btn-jump-to-column').addEventListener('click', () => {
        if (isPaused) {
          jumpToNextColumn();
          updateVisibility(); 
        }
      });
      document.getElementById('btn-previous-column').addEventListener('click', () => {
        if (isPaused) {
          goToPreviousColumn();
          updateVisibility(); 
        }
      });      
      function jumpToNextColumn() {
        currentColumn = (currentColumn + 1) % totalColumns; 
        targetRotation = rotationPerColumn * currentColumn; 
        console.log("valore current");
        animateBoxesImmediately();
        updateCenterRotation();
      }      
      function goToPreviousColumn() {
        currentColumn = (currentColumn - 1 + totalColumns) % totalColumns;        
        targetRotation = rotationPerColumn * currentColumn;
        animateBoxesImmediately();
        updateCenterRotation();
      }
      function updateCenterRotation() {
        centro.rotation.y = targetRotation;
      }      
      function animateBoxesImmediately() {
        function animateBoxes(boxesArray, startColumnIndex) {
          for (let i = 0; i < allCsvData.length; i++) {
            let targetY = allCsvData[i][startColumnIndex + currentColumn * 3];
            if (targetY <= 9) {
              targetY *= 10;
            } else if (targetY <= 99) {
              targetY += 100;
            } else if (targetY <= 999) {
              targetY /= 10;
              targetY += 200;
            } else if (targetY <= 9999) {
              targetY /= 100;
              targetY += 300;
            } else if (targetY <= 99999) {
              targetY /= 1000;
              targetY += 400;
            } else if (targetY <= 99999999) {
              targetY /= 10000;
              targetY += 500;
            }
      
            boxesArray[i].position.y = targetY;
            boxesArray[i].visible = boxesArray[i].position.y >= 1;
      
            const targetRY = i * boxSpacingX;
            boxesArray[i].rotation.y = -targetRY;
            let scaleFactor = 0.6;
            let boxTrans = boxesArray[i];
            let box = boxTrans.children[0];
            if (box) {
              const currentY = boxTrans.position.y;            
            // Logica di rotazione in base alla variazione


        
  let prevYArray = (boxesArray === boxes1) ? prevY1 : (boxesArray === boxes2) ? prevY2 : prevY3;
  let previousY = prevYArray[i];

  // Logica di rotazione in base alla variazione
  if (previousY === 0 && currentY !== 0) {
    box.rotation.x = Math.PI / 2;
  } else if (currentY > previousY) {
    box.rotation.x = -2;
  } else if (currentY < previousY) {
    box.rotation.x = 0.95;
  } else {
    box.rotation.x = Math.PI / 2;
  }

  box.position.z = -302.5 - (currentY * scaleFactor);

// Salva il valore corrente per il prossimo confronto
prevYArray[i] = currentY;
          }
          }
        }
      
        animateBoxes(boxes1, 1);
        animateBoxes(boxes2, 2);
        animateBoxes(boxes3, 3);
      }  

      let currentColumn = 0;
      let totalColumns = Math.floor(allCsvData[0].length / 3);// Numero tot colonne da considerare (1 ogni 3)
      let rotationPerColumn = -2 * Math.PI / totalColumns; // Rotazione del boxTrans
      let currentRotation = 0;
      let targetRotation = rotationPerColumn;
      function animateScene() {
        requestAnimationFrame(animateScene);
        // posizione su asse y altezza
        if (allCsvData.length > 0) {
          if (!isPaused && allCsvData.length > 0) {
          function animateBoxes(boxesArray, startColumnIndex) {
            for (let i = 0; i < allCsvData.length; i++) {
              let targetY = allCsvData[i][startColumnIndex + currentColumn * 3];
              if (targetY <= 9) { //U
                targetY *= 10;
              } else if (targetY <= 99) { //D
                targetY += 100;
              } else if (targetY <= 999) { //C
                targetY /= 10;
                targetY += 200;
              } else if (targetY <= 9999) { //M
                targetY /= 100;
                targetY += 300;
              } else if (targetY <= 99999) { //DM
                targetY /= 1000;
                targetY += 400;
              } else if (targetY <= 99999999) { //CM
                targetY /= 10000;
                targetY += 500;
              }
                  
              if (!isPaused) {
                let lerpFactor = 0.125/2;
                let lerpFactor2 = 0.00008;
                let currentY = boxesArray[i].position.y;

                


                boxesArray[i].position.y = THREE.MathUtils.lerp(currentY, targetY, lerpFactor);
                const targetRY = i * boxSpacingX;
                const currentRY = boxesArray[i].rotation.y;
                boxesArray[i].rotation.y = THREE.MathUtils.lerp(-currentRY, -targetRY, 1);
                let scaleFactor = 0.6;
                let boxTrans = boxesArray[i];
                let box = boxTrans.children[0];
              if (box) {
  let currentY = boxTrans.position.y;
  let prevYArray = (boxesArray === boxes1) ? prevY1 : (boxesArray === boxes2) ? prevY2 : prevY3;
  let previousY = prevYArray[i];

  // Direzione rotazione coda
  if (currentY > previousY) {
    box.rotation.x = -2;
  } else if (currentY < previousY) {
    box.rotation.x = 0.95;
  } else {
    box.rotation.x = Math.PI / 2;
  }

  // Aggiorna posizione z della coda
  box.position.z = -302.5 - (currentY * scaleFactor);

  // Salva il valore corrente come precedente per la prossima volta
  prevYArray[i] = currentY;
}
                prevY = boxesArray[i].position.y;
                // rotazone coda
                if (currentY > prevY) {
                  box.rotation.x = THREE.MathUtils.lerp(box.rotation.x, 0.95, lerpFactor);
                } else if (currentY < prevY) {
                  box.rotation.x = THREE.MathUtils.lerp(box.rotation.x, -2, lerpFactor);
                } else {
                  box.rotation.x = THREE.MathUtils.lerp(box.rotation.x, Math.PI / 2, lerpFactor);
                }
                // sparizione se inferiore a 1
                if (boxesArray[i].position.y < 0.999999) {
                  boxesArray[i].visible = false;
                } else {
                  boxesArray[i].visible = true;
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
                  currentColumn = (currentColumn + 1) % totalColumns; // Incrementa di 1 per passare alla colonna successiva ogni 3
                }
              }
            }
          }
          animateBoxes(boxes1, 1); 
          animateBoxes(boxes2, 2);
          animateBoxes(boxes3, 3);
        }          
        controls.update(clock.getDelta());
        renderer.render(scene, camera); 
        }           
      }
      animateScene();
    }
  };
  xhr.send();
  // ====== TORUS ======
  // COLORE
  let colorTorus = new THREE.Color('#FFFFFF');
  const torusMat = new THREE.MeshPhysicalMaterial({
    color: colorTorus,
  });
  const torus1G = new THREE.TorusGeometry( 600,0.9,128,128);
  const torus1 = new THREE.Mesh(torus1G, torusMat);
  torus1.position.set( 0, 0, 0 );
  torus1.rotation.set( Math.PI/2, 0, 0 );
  let torusZ = new THREE.Mesh(torus1G, torusMat);
  torusZ.position.set(0,300,0);
  torusZ.rotation.set( Math.PI/2, 0, 0 );
  //scene.add(torusZ);
  let torusU = torus1.clone();
  torusU.material = torus1.material.clone();
  torusU.material.color.set('#0015ff');
  let torusD = torus1.clone();
  torusD.material = torus1.material.clone();
  torusD.material.color.set('#15a1fe');
  let torusC = torus1.clone();
  torusC.material = torus1.material.clone();
  torusC.material.color.set('#00ff95');
  let torusM = torus1.clone();
  torusM.material = torus1.material.clone();
  torusM.material.color.set('#09ff00');
  let torusDM = torus1.clone();
  torusDM.material = torus1.material.clone();
  torusDM.material.color.set('#ff8400');
  let torusCM = torus1.clone();
  torusCM.material = torus1.material.clone();
  torusCM.material.color.set('#ff0000');
  let torusMM = torus1.clone();
  torusMM.material = torus1.material.clone();
  torusMM.material.color.set('#000000');
  torusU.position.set(0,-490, 0);
  torusD.position.set(0,-390, 0);
  torusC.position.set(0,-290, 0);
  torusM.position.set(0,-190, 0);  
  torusDM.position.set(0,-90, 0);
  torusCM.position.set(0, 10, 0);
  torusMM.position.set(0, 100, 0);    
  const scalU = 0.51; 
  const scalD = 0.61;
  const scalC = 0.71;
  const scalM = 0.81;
  const scalDM = 0.91; 
  const scalCM = 1.01;  
  const scalMM = 1.1; 
  torusU.scale.set(scalU,scalU,scalU); 
  torusD.scale.set(scalD,scalD,scalD);
  torusC.scale.set(scalC,scalC,scalC);
  torusM.scale.set(scalM,scalM,scalM);
  torusDM.scale.set(scalDM,scalDM,scalDM); 
  torusCM.scale.set(scalCM,scalCM,scalCM);
  torusMM.scale.set(scalMM,scalMM,scalMM);  
  const misuratore = new THREE.Group();
  misuratore.add(torusU, torusD, torusC, torusM,torusDM, torusCM, torusMM);
  scene.add(misuratore);
  misuratore.position.set(0,300,0);
  const btnQuantity = document.getElementById('btn-quantity');
    btnQuantity.addEventListener('click', () => {
    misuratore.visible = !misuratore.visible;       
  });
  const colorsArray2 = [
    "#797979","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000",
  ];
  // Mappa decine → materiale di riferimento
  const decadeMats = [
    torusU.material,   // 0–9
    torusD.material,   // 10–19
    torusC.material,   // 20–29
    torusM.material,   // 30–39
    torusDM.material,  // 40–49
    torusCM.material   // 50–59
  ];
  // Gruppo per i torus "contatore"
  const counterGroup = new THREE.Group();
  scene.add(counterGroup);
  for (let i = 0; i < 60; i++){
    const torus2G = new THREE.TorusGeometry( 300,0.25, 128, 128 );
    const torus2 = new THREE.Mesh(torus2G);
    const decade  = Math.floor(i/10);
    torus2.material = decadeMats[decade];
    torus2.position.set(0,-189.5+(i*10),0);
    torus2.rotation.set( Math.PI/2,0,0);
    let scaleTorus2 = 1.02 + i/50;
    torus2.scale.set(scaleTorus2, scaleTorus2,1);
    scene.add(torus2);     
    torus2.visible = !torus2.visible; 
    const btnCount = document.getElementById('btn-count');
    btnCount.addEventListener('click', () => {
      torus2.visible = !torus2.visible;     
    });
  }
  // ====== CALENDAR BOXES
  for (let i = 0; i < 12; i++){  
    let gCalendar = new THREE.CylinderGeometry(30,30,1,64,64) 
    let mCalendar = new THREE.MeshPhysicalMaterial({
      color:colorsArray2[i], 
    })
    let calendar = new THREE.Mesh(gCalendar, mCalendar);
    scene.add(calendar);
    calendar.position.set(0,400,-700);
    let gCCalendar = new THREE.BoxGeometry(30,30,30)    
    const mCCalendar = new THREE.MeshPhysicalMaterial({
      color: 0xff2222,
      transparent: true,
      opacity: 0,       
    });
    let cCalendar = new THREE.Mesh(gCCalendar, mCCalendar);
    cCalendar.position.set(0,0,0);
    cCalendar.add(calendar);
    cCalendar.rotation.set(0,-i/1.91,0);
    scene.add(cCalendar);        
    cCalendar.castShadow = true;
    cCalendar.receiveShadow = true;
  }

  // ====== BUTTONS ======
  const btnCameraC = document.getElementById('btn-cameraC');
  btnCameraC.addEventListener('click', () => {
    camera.position.set( 0, 500, 0 );
  });
  const btnCameraH = document.getElementById('btn-cameraH');
  btnCameraH.addEventListener('click', () => {
    camera.position.set( 0, 3900, 0 );          
  });
  const btnPause = document.getElementById('btn-pause');
  btnPause.addEventListener('click', () => {
    isPaused = true;
  });
  const btnPlay = document.getElementById('btn-play');
  btnPlay.addEventListener('click', () => {
    isPaused = false;    
  });  
};