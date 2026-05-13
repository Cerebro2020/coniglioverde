import * as THREE from 'three';
import { PointerLockControls } from '../three_class/PointerLockControls.js';
import { GLTFLoader } from '../three_class/GLTFLoader.js';

import { EffectComposer } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { Pass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/Pass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.158.0/examples/jsm/shaders/FXAAShader.js';
import { AfterimagePass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/AfterimagePass.js';

const clock = new THREE.Clock();
const scene = new THREE.Scene();

// ATMOSFERA
scene.fog = new THREE.FogExp2(0x050507, 0.018);

// BACKGROUND
const loader2 = new THREE.TextureLoader();

loader2.load('images/equiangular/Space_4.jpg', texture => {

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = texture;

});

// CAMERA
let player = {
  height: 2.1,
  speed: 0.2
};

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, player.height, 0);
camera.setFocalLength(15);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// ===== CUSTOM PASS ==========================================
class CustomPass extends Pass {

  constructor() {

    super();

    this.uniforms = {
      tDiffuse: { value: null },
      time: { value: 0 },
      amount: { value: 0.0012 },
      resolution: {
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight
        )
      }
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
        uniform float amount;

        varying vec2 vUv;

        void main() {

          vec2 off = vec2(amount, 0.0);

          float r = texture2D(tDiffuse, vUv + off).r;
          float g = texture2D(tDiffuse, vUv).g;
          float b = texture2D(tDiffuse, vUv - off).b;

          gl_FragColor = vec4(r, g, b, 1.0);

        }

      `,

      depthWrite: false,
      depthTest: false

    });

    this.camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      1
    );

    this.scene = new THREE.Scene();

    this.quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this.material
    );

    this.scene.add(this.quad);

    this.needsSwap = true;

  }

  render(renderer, writeBuffer, readBuffer) {

    this.uniforms.tDiffuse.value = readBuffer.texture;

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

// ===== POST PROCESSING ======================================

const composer = new EffectComposer(renderer);

composer.setSize(
  window.innerWidth,
  window.innerHeight
);

// RENDER PASS
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// BLOOM
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  ),
  0.25,
  0.35,
  0.88
);

composer.addPass(bloomPass);

// FXAA
const fxaaPass = new ShaderPass(FXAAShader);

fxaaPass.material.uniforms['resolution'].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);

composer.addPass(fxaaPass);

// AFTER IMAGE
const afterimagePass = new AfterimagePass(0.25);
composer.addPass(afterimagePass);

// CHROMATIC ABERRATION
const customPass = new CustomPass();
customPass.renderToScreen = true;

composer.addPass(customPass);

// ===== CONTROLS =============================================

const controls = new PointerLockControls(
  camera,
  document.body
);

scene.add(controls.getObject());

controls.getObject().position.y = player.height;

document.body.addEventListener('click', () => {

  controls.lock();

});

// ===== RESIZE ===============================================

window.addEventListener('resize', () => {

  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer.setSize(w, h);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  composer.setSize(w, h);

  bloomPass.setSize(w, h);
  afterimagePass.setSize(w, h);
  customPass.setSize(w, h);

  fxaaPass.material.uniforms['resolution'].value.set(
    1 / w,
    1 / h
  );

});

// ===== MOVIMENTO ============================================

const move = {
  forward: false,
  backward: false,
  left: false,
  right: false
};

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

document.addEventListener('keydown', e => {

  switch (e.code) {

    case 'KeyW':
      move.forward = true;
      break;

    case 'KeyS':
      move.backward = true;
      break;

    case 'KeyA':
      move.left = true;
      break;

    case 'KeyD':
      move.right = true;
      break;

  }

});

document.addEventListener('keyup', e => {

  switch (e.code) {

    case 'KeyW':
      move.forward = false;
      break;

    case 'KeyS':
      move.backward = false;
      break;

    case 'KeyA':
      move.left = false;
      break;

    case 'KeyD':
      move.right = false;
      break;

  }

});

// ===== TEST BOX =============================================

const boxGeometry = new THREE.BoxGeometry(4, 10, 10);

const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.3,
  metalness: 0.1
});

const box = new THREE.Mesh(
  boxGeometry,
  boxMaterial
);

box.position.set(5, 5, -5);

// ===== COLLISIONI ===========================================

const collidableObjects = [box];

// ===== GLTF =================================================

const lSala = new GLTFLoader();

lSala.load(

  '3d/warring/warring.glb',

  function (glt) {

    const lSala = glt.scene;

    lSala.position.set(0, -17, -10);

    lSala.rotation.set(
      0,
      -Math.PI / 2,
      0
    );

    lSala.traverse(function (node) {

      if (node.isMesh) {

        node.castShadow = true;
        node.receiveShadow = true;

        if (node.material) {

          node.material = new THREE.MeshPhysicalMaterial({

            map: node.material.map || null,

            color:
              node.material.color ||
              new THREE.Color(0xffffff),

            roughness: 0.45,
            metalness: 0.08,

            clearcoat: 0.25,
            clearcoatRoughness: 0.35,

            envMapIntensity: 1.2

          });

        }

        node.geometry.computeBoundingBox();

        const size = new THREE.Vector3();

        node.geometry.boundingBox.getSize(size);

        if (size.length() > 1.0) {

          collidableObjects.push(node);

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

// ===== LUCI =================================================

const ambientLight = new THREE.AmbientLight(
  0xffdddd,
  0.22
);

scene.add(ambientLight);

// LUCE BLU
const blueFill = new THREE.PointLight(
  0x2244ff,
  0.9,
  900
);

blueFill.position.set(
  -80,
  30,
  -120
);

scene.add(blueFill);

// LUCE CALDA
const warmFill = new THREE.PointLight(
  0xff8844,
  0.7,
  700
);

warmFill.position.set(
  90,
  20,
  80
);

scene.add(warmFill);

// LUCE ALTA
const topLight = new THREE.SpotLight(
  0xffffff,
  1.5
);

topLight.position.set(
  0,
  120,
  0
);

topLight.angle = Math.PI / 4;
topLight.penumbra = 1;
topLight.decay = 2;
topLight.distance = 800;

topLight.castShadow = true;

topLight.shadow.mapSize.width = 2048;
topLight.shadow.mapSize.height = 2048;

scene.add(topLight);

// ===== TORCIA ===============================================

const flash = new THREE.SpotLight(
  0xffffff,
  2.4,
  900,
  Math.PI / 6,
  0.75,
  1.4
);

flash.position.set(0, 0, 0);

flash.castShadow = true;

flash.shadow.mapSize.width = 2048;
flash.shadow.mapSize.height = 2048;

flash.shadow.camera.near = 0.1;
flash.shadow.camera.far = 1200;

flash.shadow.bias = -0.00015;

camera.add(flash);

scene.add(flash.target);

const dir = new THREE.Vector3();
const flashWorldPosition = new THREE.Vector3();

// ===== COLLISIONE ===========================================

function checkCollision(pos) {

  const playerBox =
    new THREE.Box3().setFromCenterAndSize(

      pos,

      new THREE.Vector3(
        1,
        player.height,
        1
      )

    );

  return collidableObjects.some(obj => {

    const objBox = new THREE.Box3()
      .setFromObject(obj);

    return playerBox.intersectsBox(objBox);

  });

}

// ===== ANIMATE ==============================================

function animate() {

  requestAnimationFrame(animate);

  // TORCIA
  camera.getWorldPosition(flashWorldPosition);

  camera.getWorldDirection(dir);

  flash.target.position
    .copy(flashWorldPosition)
    .add(dir.multiplyScalar(80));

  flash.target.updateMatrixWorld();

  if (controls.isLocked) {

    const delta = clock.getDelta();

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z =
      Number(move.forward) -
      Number(move.backward);

    direction.x =
      Number(move.right) -
      Number(move.left);

    direction.normalize();

    const moveVector = new THREE.Vector3(

      Number(move.right) -
      Number(move.left),

      0,

      Number(move.backward) -
      Number(move.forward)

    );

    if (moveVector.lengthSq() > 0) {

      moveVector.normalize();

      const directionVector =
        new THREE.Vector3();

      controls.getDirection(directionVector);

      directionVector.y = 0;

      directionVector.normalize();

      const right =
        new THREE.Vector3().crossVectors(

          directionVector,

          new THREE.Vector3(0, 1, 0)

        );

      const velocityVector =
        new THREE.Vector3();

      velocityVector.addScaledVector(
        directionVector,
        -moveVector.z
      );

      velocityVector.addScaledVector(
        right,
        moveVector.x
      );

      velocityVector.multiplyScalar(
        player.speed * 150.0 * delta
      );

      const position =
        controls.getObject().position.clone();

      const nextPosition =
        position.clone().add(velocityVector);

      if (!checkCollision(nextPosition)) {

        controls
          .getObject()
          .position.copy(nextPosition);

      }

    }

  }

  composer.render();

}

animate();