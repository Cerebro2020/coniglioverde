import * as THREE from 'three';
import Stats  from './three_class/stats.module.js';
import { FirstPersonControls } from './three_class/FirstPersonControls.js';
import { FlakesTexture } from './three_class/FlakesTexture.js';
//import { RGBELoader } from './three_class/RGBELoader.js';
import { OBJLoader } from './three_class/OBJLoader.js';
import { CapsuleGeometry } from './three_class/CapsuleGeometry.js';
//import { BooleanKeyframeTrack } from './three_class/three.module.js';

export default function(choose,quadri){
  // BASE  
  const stats=new Stats();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 1000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true}) ;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //document.body.appendChild(stats.dom);
  
  // TEXTURE
  const loader = new THREE.TextureLoader();
 
  const tSphere = /*loader.load('static/images/Texture/TFloor1C.jpg');*/new THREE.CanvasTexture(new FlakesTexture());
  tSphere.wrapS = THREE.RepeatWrapping;
  tSphere.wrapT = THREE.RepeatWrapping;
  tSphere.repeat.x = 10;
  tSphere.repeat.y = 6;
  
  

  const dPetalL = loader.load('static/images/Displace/DPetalL.jpg');
  const dPetalR = loader.load('static/images/Displace/DPetalR.jpg');

  const aPetalL = loader.load('static/images/Alpha/APetalL.jpg');
  const aPetalR = loader.load('static/images/Alpha/APetalR.jpg');

  const tFloor = loader.load('static/images/Texture/TFloor1C.jpg');
  const dFloor = loader.load('static/images/Displace/DFloor1C.jpg');
  const aFloor = loader.load('static/images/Alpha/AFloor1.jpg');

  const tPaint = loader.load('static/galleria/03Hernst.jpg');

  // RESIZE WINDOW
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  } );

  // SCENE & FOG
  scene.background = new THREE.Color( 0x000000 ); 
  scene.fog = new THREE.FogExp2( 0x000000, 0.01, );
  const clock = new THREE.Clock();
  // CAMERA
  camera.position.set( 0, 10, -50);
  camera.lookAt(new THREE.Vector3( 0, player.height, 0));
  //camera.setLens( 15 );
  camera.setFocalLength ( 25 );

  // FIRST PERSON CONTROLS
  const controls = new FirstPersonControls( camera, renderer.domElement );
  controls.lookAt(new THREE.Vector3( 0, player.height, 0));
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.07;
  controls.autoForward = false; 

  // AMBIENT LIGHT
  const light = new THREE.AmbientLight( 0xffffff, 0.7 ); // soft white light
  scene.add( light ); 

  //POINT LIGHT
  const lightP = new THREE.PointLight( 0xcccccc, 1, 300 );
  lightP.position.set( 0, -12, 0);
  lightP.shadow.mapSize.width = 1024;
  lightP.shadow.mapSize.height = 1024;
  scene.add( lightP );
  
  //DIRECTIONAL LIGHT
  let firstLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
  firstLight.position.set( 5, 5, 0 ).normalize();
  firstLight.castShadow = true; // default
  firstLight.shadow.mapSize.width = 1024; // default
  firstLight.shadow.mapSize.height = 1024; // default
  firstLight.shadow.camera.near = 0.5; // default
  firstLight.shadow.camera.far = 500; // default
  scene.add( firstLight );


  // ANIMATE SCENE
  function animateScene(){
    requestAnimationFrame( animateScene );
    controls.update(clock.getDelta());
    stats.update();
    renderer.render( scene, camera );
  }

  animateScene();

  //let object;

  // MANAGER
  //const CrisalideMtl = new THREE.MTLLoader();
  //CrisaliMtl.load('static/crisalide6.mtl', 
    //function(materials){
      //materials.preload();
      //let objLoader = new THREE.OBJloader();
      //objLoader.setMaterials(materials);
      //objLoader.load('static/crisalide6.mtl'),
      //function(mesh){
        //scene.add(mesh);
      //}
    //}
  //);  
  
  /*const loaderCrisalide = new OBJLoader();
  let bodyCa;
  let crisalideGroup = new THREE.Group();

  // LOAD A RESOURCE
  loaderCrisalide.load(
    /*'static/crisalide7.obj',
    function ( object ) {
      object.position.set(6.5, -10, 4);
      object.rotation.set(0, 3, -0.1);
      try{
      const matTransp=new THREE.MeshPhysicalMaterial({
        color:0xcccccc,
        roughness: 0.01,
        clearcoat: 1,
        clearcoatRoughness: 0,
        metalness: 0.5,
        opacity: 0.5,
        alphaTest: 0.05,
        transparent: true,
        visible: true
      })
      /*new THREE.MeshPhysicalMaterial({
        metalness: .9,
        roughness: .05,
        envMapIntensity: 0.9,
        clearcoat: 1,
        transparent: true,
        // transmission: .95,
        opacity: .5,
        reflectivity: 0.2,
        refractionRatio: 0.985,
        ior: 0.9,
        side: THREE.BackSide,
        })
        */
      /*object.children[0].material=matTransp;
    }catch(e){
      console.log(e);
    }
      bodyCa=object;
      crisalideGroup.add(bodyCa);
      console.log('body was loaded',bodyCa);
      scene.add( bodyCa );  
    },
    // called when loading is in progresses
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error happened' );
    }
  );*/

  let crisalideGroup = new THREE.Group();

  // SPHERE 1
  const sphereA1Geometry = new THREE.SphereGeometry( 0.4, 25, 25 );
  const sphereA1Material = new THREE.MeshPhysicalMaterial( { 
    color: 'black',
    //normalMap: tSphere,
    roughness: 0.01,
    clearcoat: 0.5,
    metalness: 0.5,    
  } );
  
  const sphereA1 = new THREE.Mesh(sphereA1Geometry, sphereA1Material);
  sphereA1.position.set( 0, 15, 0);
  sphereA1.castShadow=true;
  
  
  // SPHERE 5
  const sphereA5Geometry = new THREE.SphereGeometry( 0.4, 20, 20 );
  const sphereA5Material = new THREE.MeshPhysicalMaterial( {
    color: 'black',
    roughness: 0.01,
    clearcoat: 0.5,
    metalness: 0.5,    
  });
 
  const sphereA5 = new THREE.Mesh(sphereA5Geometry, sphereA5Material);
  sphereA5.position.set( 0, 8.5, 2.5);  
  sphereA5.castShadow=true;

  // SPHERE AC
  const gSphereAC = new THREE.SphereGeometry( 2, 25, 25 );
  const mSphereAC = new THREE.MeshPhysicalMaterial( {
    color: 'white',     
    clearcoat: 1.0,
    clearcoatRoughness:0.1,
    metalness: 0.9,
    roughness: 0.5,         
  });

   // SPHERE AC2
   const gSphereAC2 = new THREE.SphereGeometry( 1.4, 25, 25 );
   const mSphereAC2 = new THREE.MeshPhysicalMaterial( {
     color: 'white',     
     clearcoat: 1.0,
     clearcoatRoughness:0.1,
     metalness: 0.9,
     roughness: 0.5,         
   }); 

  const sphereAC = new THREE.Mesh( gSphereAC, mSphereAC);
  sphereAC.position.set(0, 13.25, 1);
  const sphereAC2 = new THREE.Mesh( gSphereAC2, mSphereAC2);
  sphereAC2.position.set(0, 10.25, 1.5);

  // CRISALIDE GROUP
  crisalideGroup.add( sphereA1, sphereA5, sphereAC, sphereAC2);
  const crisalidi=_.map(choose,(v,k)=>{
   

  //WING
  const tPetalL = loader.load(`static/galleria/${quadri[k]}`);
  const tPetalR = loader.load(`static/galleria2/${quadri[k]}`);
  const wingLGeometry = new THREE.PlaneGeometry( 12, 12, 12, 12 );
  const wingLMaterial = new THREE.MeshPhongMaterial( {
    opacity: 0.9,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
    map: tPetalL,
    displacementMap: dPetalL,
    displacementScale: 0.7,
    opacity: 0.5,
    alphaMap: aPetalL,
    transparent: true,
  });

  const wingRGeometry = new THREE.PlaneGeometry( 12, 12, 20, 20 );
  const wingRMaterial = new THREE.MeshPhongMaterial( {
    opacity: 0.9,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
    map: tPetalR,
    displacementMap: dPetalR,
    displacementScale: 0.7,
    opacity: 0.5,
    alphaMap: aPetalR,
    transparent: true,
  });
    
  const wing1 = new THREE.Mesh( wingLGeometry, wingLMaterial );
  wing1.position.set( -2.5, 15, 0.4);
  wing1.rotation.set(0 , -0.2, 0);
  wing1.scale.set(0.4, 0.4, 0.4);
  wing1.castShadow=true;

  const wing2 = new THREE.Mesh( wingRGeometry, wingRMaterial );
  wing2.position.set( 2.5, 15, 0.4);
  wing2.rotation.set(0 , 0.2, 0);
  wing2.scale.set(0.4, 0.4, 0.4);
  wing2.castShadow=true;

  const wing3 = new THREE.Mesh( wingLGeometry, wingLMaterial );
  wing3.position.set( -2.6, 15.5, 0.3);
  wing3.rotation.z = -1;
  wing3.scale.set(0.3, 0.3, 0.3);
  wing3.castShadow=true;
    
  const wing4 = new THREE.Mesh( wingRGeometry, wingRMaterial );
  wing4.position.set( 2.6, 15.5, 0.3);
  wing4.rotation.z = 1;
  wing4.scale.set(0.3, 0.3, 0.3);
  wing4.castShadow=true;

  const wing5 = new THREE.Mesh( wingLGeometry, wingLMaterial );
  wing5.position.set( -2.5, 14.5, 0.2);
  wing5.rotation.set(0,0,1);
  wing5.scale.set(0.3, 0.3, 0.3);
  wing5.castShadow=true;

  const wing6 = new THREE.Mesh( wingRGeometry, wingRMaterial );
  wing6.position.set( 2.5, 14.5, 0.2);
  wing6.rotation.set(0,0,-1);
  wing6.scale.set(0.3, 0.3, 0.3);
  wing6.castShadow=true;

  // SPHERE BODY
  const sphere = new THREE.SphereGeometry( 1, 25, 25 );
  const sphereMaterial = new THREE.MeshPhysicalMaterial( {
    color: v[0],    
    clearcoat: 1.0,
    clearcoatRoughness:0.1,
    metalness: 0.9,
    roughness: 0.5,
    //reflectivity: 1,
    normalMap: tSphere,
    normalScale: new THREE.Vector2(0.5,0.5),       
  }); 
  
  const sphereA2 = new THREE.Mesh(sphere, sphereMaterial);  //A2
  sphereA2.position.set( 0, 14.5, 0 );
  sphereA2.castShadow = true;
    
  let newMat = sphereMaterial.clone()
  newMat.color = new THREE.Color(v[1]);
  const sphereA3 = new THREE.Mesh(sphere, newMat);  //A3
  //sphereA3.material.color=new THREE.Color(v[1]);
  sphereA3.position.set( 0, 11.5, 0.2 );  
  sphereA3.castShadow = true;

  //sphereMaterial.color=v[2];
  newMat = sphereMaterial.clone();
  newMat.color = new THREE.Color(v[2]);
  const sphereA4 = new THREE.Mesh(sphere, newMat);  // A4
    //sphereA3.material.color= new THREE.Color(v[2]);
    sphereA4.position.set( 0, 9.2, 2 );
    sphereA4.castShadow = true;

    const ret = crisalideGroup.clone(true);
    ret.add(sphereA2,sphereA3,sphereA4,wing1,wing2,wing3,wing4,wing5,wing6);
    scene.add(ret);
    ret.position.set( 10 * Math.cos(k), 2 * Math.cos(k), 12*k);
    ret.rotation.set( 0, 2 * Math.cos(k), 0 );
    return ret;
  })
   
  // FLOOR
  let floor;
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry( 1000, 1000, 100, 100 ),
    new THREE.MeshPhongMaterial({
      color: 'pink',  //0xE783C1, 
      side: THREE.DoubleSide,
      //flatShading: THREE.FlatShading,
      map: tFloor,      
      displacementMap: dFloor,
      displacementScale: 10,
      alphaMap: aFloor,
      opacity: 0.4,
      transparent: false,
      shininess: 10,
    })
  );

  floor.rotation.x -= Math.PI / 2; 
  floor.position.y = -20;
  scene.add( floor );

  // SKY
  let sky;
  sky = new THREE.Mesh(
    new THREE.PlaneGeometry( 1000, 1000, 500, 500 ),
    new THREE.MeshPhongMaterial({
      color: 'pink',  //0xE783C1, 
      side: THREE.DoubleSide,       
      //map: tFloor,      
      displacementMap: dFloor,
      displacementScale: 20,
      alphaMap: aFloor,
      transparent: false,       
    })
  );
  
  sky.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
  sky.position.y = 50;
  scene.add( sky );

  const gSeed = new THREE.SphereGeometry( 0.1, 30, 30 );
  const mSeed = new THREE.MeshPhongMaterial( { 
    color: 'white',    
    opacity: 0.5,
    transparent: true,
    receiveShadow: true,
  } );

  let seed;
  
  let seedArr=[];
  for(let i=0;i<2000;i++){
    seed = new THREE.Mesh( gSeed, mSeed );
    seed.position.x = Math.random()*200-100;
    seed.position.y = Math.random()*10;
    seed.position.z = Math.random()*800-600;   
    seedArr.push(seed);
    scene.add(seed);
  };

  //let altezza;

  //function animateCris(){
 //   for (let i = 0; i < 10; i = i++ )
//   altezza = i;
  //}

 // animateCris();

  const domeEvent = new THREE.DomeEvents(camera, renderer.domelement);

  domeEvent.addEventListener(sphere, 'mouseover', event => {
    sphere.scale.set(2) 
  });

    

   
  //AUDIO
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const audioLoader = new THREE.AudioLoader();
  const backgroundSound = new THREE.Audio( listener );
  audioLoader.load('audio/436557__k2tr__major-drone02.wav', function( buffer ) {
    backgroundSound.setBuffer( buffer );
    backgroundSound.setLoop( true );
    backgroundSound.setVolume( 0.4 );
    backgroundSound.play();
  });

};