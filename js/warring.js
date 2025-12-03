
import * as THREE from 'three';
import { PointerLockControls } from '../three_class/PointerLockControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

const clock = new THREE.Clock();
const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0x008888);
const loader2 = new THREE.TextureLoader();
loader2.load('images/equiangular/Sky_S4.png', texture => {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

let player = { height: 2.1, speed: 0.2 };
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, player.height, 0); 
camera.setFocalLength(15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS //
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());
controls.getObject().position.y = player.height;

document.body.addEventListener('click', () => controls.lock());

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
});

const move = { forward: false, backward: false, left: false, right: false };
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': move.forward = true; break;
        case 'KeyS': move.backward = true; break;
        case 'KeyA': move.left = true; break;
        case 'KeyD': move.right = true; break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': move.forward = false; break;
        case 'KeyS': move.backward = false; break;
        case 'KeyA': move.left = false; break;
        case 'KeyD': move.right = false; break;
    }
});

// Piano
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
// scene.add(floor);

// Cubo di test
const boxGeometry = new THREE.BoxGeometry(4, 10, 10);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(5, 5, -5);
// scene.add(box);

// === SCENA  === //
const lSala = new GLTFLoader(); 
lSala.load(    
  '3d/warring/warring.glb',
  function (glt) {
    const lSala = glt.scene;
    lSala.position.set(0,-17,-10);
    lSala.rotation.set(0,-Math.PI/2, 0 );  

    lSala.traverse(function (node) {
  if (node.isMesh) {
    // const material = new THREE.MeshPhysicalMaterial({
    //   color: 0x333333,
    //   roughness: 1,
    //   bumpScale: -0.001,
    //   side: THREE.DoubleSide
    // });
    // node.material = material;
    node.castShadow = true;
    node.receiveShadow = true;

    node.geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    node.geometry.boundingBox.getSize(size);

    //Accettiamo solo mesh di dimensioni decenti
    if (size.length() > 1.0) {
      collidableObjects.push(node);
      console.log('Collider aggiunto:', node.name, size.length());
    }
  }
});     

    scene.add(lSala);   
  },   
  undefined,
  function (error) {
    console.error(error);      
  }     
);

// Collider per il cubo
const collidableObjects = [box];

// LIGHT
// AMBIENTE
// const light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
const light = new THREE.AmbientLight(0xffdddd, 0.1);
light.position.set(0, 10, 0);
scene.add(light);
// SPOT
const spot = new THREE.SpotLight(0xccccff,1.2,1600);
spot.position.set(0,200,-380);
spot.angle = Math.PI/16;
spot.penumbra = 0.5;
spot.decay = 3;
spot.distance = 6000;
spot.castShadow = true;
spot.shadow.mapSize.width = 2048;
spot.shadow.mapSize.height = 2048;
spot.shadow.radius = 4;
spot.shadow.camera.near = 0.1; 
spot.shadow.camera.far = 10000;
spot.shadow.bias = -0.0005;
// scene.add(spot);
// const spotH = new THREE.SpotLightHelper(spot);
// scene.add(spotH);
// POINT 
// PointLight + helper
const pointLight = new THREE.PointLight(0xccccff, 1, 3000, 5);
pointLight.position.set(0,380,-380);
// scene.add(pointLight);

const helper = new THREE.PointLightHelper(pointLight, 0.2 /* sphere size for helper */);
//scene.add(helper);

function checkCollision(pos) {
    const playerBox = new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(1, player.height, 1));
    return collidableObjects.some(obj => {
        const objBox = new THREE.Box3().setFromObject(obj);
        return playerBox.intersectsBox(objBox);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        const delta = clock.getDelta();

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(move.forward) - Number(move.backward);
        direction.x = Number(move.right) - Number(move.left);
        direction.normalize();

        const moveVector = new THREE.Vector3(
        Number(move.right) - Number(move.left),
        0,
        Number(move.backward) - Number(move.forward)
      );

      if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
    
    // Trasforma in base alla direzione della camera
    const directionVector = new THREE.Vector3();
    controls.getDirection(directionVector);
    directionVector.y = 0; // ignora l'altezza
    directionVector.normalize();

    // Costruiamo il vettore movimento locale
    const right = new THREE.Vector3().crossVectors(directionVector, new THREE.Vector3(0, 1, 0));
    const velocityVector = new THREE.Vector3();
    velocityVector.addScaledVector(directionVector, -moveVector.z); // avanti/indietro
    velocityVector.addScaledVector(right, moveVector.x); // destra/sinistra

    // VELOCITA DI SPOSTAMENTO
    velocityVector.multiplyScalar(player.speed * 150.0 * delta);

    const position = controls.getObject().position.clone();
    const nextPosition = position.clone().add(velocityVector);

    if (!checkCollision(nextPosition)) {
        controls.getObject().position.copy(nextPosition);
    }
  }

  } 
  renderer.render(scene, camera);
}
animate();