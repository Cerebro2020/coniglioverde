import * as THREE from 'three';
import { PointerLockControls } from '../three_class/PointerLockControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';
import { EffectComposer } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { Pass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/Pass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.158.0/examples/jsm/shaders/FXAAShader.js';



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

class CustomPass extends Pass {
    constructor() {
        super();

        this.uniforms = {
            tDiffuse: { value: null },
            time: { value: 0 },
            amount: { value: 0.002 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float time;
                uniform float amount;
                uniform vec2 resolution;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;

                    // Chromatic aberration
                    vec2 off = vec2(amount, 0.0);
                    float r = texture2D(tDiffuse, uv + off).r;
                    float g = texture2D(tDiffuse, uv).g;
                    float b = texture2D(tDiffuse, uv - off).b;

                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            `,
            depthWrite: false,
            depthTest: false
        });

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
        this.scene.add(this.quad);

        this.needsSwap = true;
    }

    render(renderer, writeBuffer, readBuffer) {
        this.uniforms.tDiffuse.value = readBuffer.texture;
        this.uniforms.time.value += 0.016;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            renderer.render(this.scene, this.camera);
        } else {
            renderer.setRenderTarget(writeBuffer);
            renderer.render(this.scene, this.camera);
        }
    }

    setSize(w, h) {
        this.uniforms.resolution.value.set(w, h);
    }
}

const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.6,   // strength
    0.4,   // radius
    0.85   // threshold
);
// composer.addPass(bloomPass);

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms['resolution'].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
);
// composer.addPass(fxaaPass);

// fxaaPass.material.uniforms['resolution'].value.set(
//     1 / w,
//     1 / h
// );

const customPass = new CustomPass();
customPass.renderToScreen = true;
composer.addPass(customPass);

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

    composer.setSize(w, h);
    customPass.setSize(w, h);
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
    lSala.rotation.set(0,-Math.PI/2,0);
    lSala.traverse(function (node) {
  if (node.isMesh) {

    node.castShadow = true;
    node.receiveShadow = true;

    node.geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    node.geometry.boundingBox.getSize(size);

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
const light = new THREE.AmbientLight(0xffdddd, 0.1);
light.position.set(0, 10, 0);
scene.add(light);

// CREA la torcia (NESSUNA modifica non necessaria)
const flash = new THREE.SpotLight(0xffffff, 1, 2000, Math.PI / 4, 0.4, 1.5);
flash.castShadow = true;

// attacca SOLO la luce
camera.add(flash);

// il target va nella scena, NON sulla camera
scene.add(flash.target);

// direzione re-usabile
const dir = new THREE.Vector3();

function checkCollision(pos) {
    const playerBox = new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(1, player.height, 1));
    return collidableObjects.some(obj => {
        const objBox = new THREE.Box3().setFromObject(obj);
        return playerBox.intersectsBox(objBox);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // --- TORCIA: solo fix minimo ---
    camera.getWorldPosition(flash.position);
    camera.getWorldDirection(dir);
    flash.target.position.copy(flash.position).add(dir.multiplyScalar(20));
    flash.target.updateMatrixWorld();
    // -------------------------------

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
    
    const directionVector = new THREE.Vector3();
    controls.getDirection(directionVector);
    directionVector.y = 0;
    directionVector.normalize();

    const right = new THREE.Vector3().crossVectors(directionVector, new THREE.Vector3(0, 1, 0));
    const velocityVector = new THREE.Vector3();
    velocityVector.addScaledVector(directionVector, -moveVector.z);
    velocityVector.addScaledVector(right, moveVector.x);

    velocityVector.multiplyScalar(player.speed * 150.0 * delta);

    const position = controls.getObject().position.clone();
    const nextPosition = position.clone().add(velocityVector);

    if (!checkCollision(nextPosition)) {
        controls.getObject().position.copy(nextPosition);
    }
  }

  } 

  composer.render();
}
animate();
