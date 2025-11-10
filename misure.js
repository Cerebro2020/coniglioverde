import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';

export default function(){
    // Scena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );
    camera.position.set(0, 2, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cubo 1x1x1
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(1,0,0);
    scene.add(cube);

    const loader = new GLTFLoader();

    loader.load(
    './3d/blender.glb',
    gltf => {
        const model = gltf.scene;
        model.position.set(0, 0, 0); // posizione iniziale
        scene.add(model);
    },
    undefined,
    error => {
        console.error('Errore nel caricamento del modello:', error);
    }
    );

    // Luci
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 3, 3);
    scene.add(light);

    // Controlli
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Loop
    function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    });
};