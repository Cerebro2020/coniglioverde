import * as THREE from 'three';
import {OrbitControls} from './three_class/OrbitControls.js';
import { GLTFLoader } from './three_class/GLTFLoader.js';

export default function(){

  // SCENE  
  const scene = new THREE.Scene();
  
  //CAMERA
  const camera = new THREE.PerspectiveCamera( 25 , window.innerWidth / window.innerHeight, 0.1, 10000 );
  let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

  //RENDERER
  const renderer = new THREE.WebGLRenderer({    
    alpha:true, 
    antialias:true}) ;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
 
  // RESIZE WINDOW
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  } );

  // TEXTURES
  const loader = new THREE.TextureLoader();  
  const TextureV1 = loader.load('./video/cinematic/AS_1.png');
  const TextureV2 = loader.load('./video/cinematic/AS_2.png');
  const TextureV3 = loader.load('./video/cinematic/AS_2.png');
  const TextureV4 = loader.load('./video/cinematic/AS_2.png');
  const TextureV5 = loader.load('./video/cinematic/AS_5.png');
  const TextureV6 = loader.load('./video/cinematic/AS_6.png');
  const TextureV7 = loader.load('./video/cinematic/AS_D.png');
 

  // SCENE & FOG
  //scene.background = new THREE.Color( 0xff0000 );
  
  // CAMERA
  camera.position.set( 0, 1.5, 20);
  camera.lookAt(new THREE.Vector3( 0, player.height, -200)); 
  camera.setFocalLength ( 25);
   // ORBIT CONTROLS
  const controls = new OrbitControls( camera, renderer.domElement );  
  controls.listenToKeyEvents( window ); 
  controls.minDistance = 0;
  controls.maxDistance = 20;
  controls.maxPolarAngle = 1.5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  
  // LIGHTS
  //AMBIENT
  const ambiente = new THREE.AmbientLight ( 0xffffff, 1 )
  scene.add( ambiente);
  //POINT
  const pointLight = new THREE.PointLight( 0xffffff, 0.05, 1000);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024; // default
  pointLight.shadow.mapSize.height = 1024; // default
  pointLight.shadow.camera.near = 0.01; // default
  pointLight.shadow.camera.far = 0.1; // default

  pointLight.position.set(0,0,-86);

  let pointLight2 = pointLight.clone();
  let pointLight2a = pointLight.clone();
  let pointLight3 = pointLight.clone();
  let pointLight3a = pointLight.clone();
  pointLight2.position.set(-24,0,-66);
  pointLight2a.position.set(24,0,-66);
  pointLight3.position.set(-24,0,-36);
  pointLight3a.position.set(24,0,-36);

  let helper = new THREE.PointLightHelper(pointLight2);   
  scene.add( pointLight, /*helper,*/ pointLight2, pointLight2a, pointLight3, pointLight3a ); 
  
  // ANIMATE SCENE
  function animateScene(){
    requestAnimationFrame( animateScene );
    renderer.render( scene, camera );
  };
  animateScene();

  // UV MAP //
  // const uvLoader = new THREE.TextureLoader();
  // const uvPaper = uvLoader.load('images/uvmap/paper.jpg');
  // uvPaper.wrapS = THREE.RepeatWrapping;
  // uvPaper.wrapT = THREE.RepeatWrapping;
  // uvPaper.repeat.set(8, 8); 

  // VIDEO A1
  // var videoA1 = document.createElement('video');
  // videoA1.src = "./video/cinematic/BF_A1.mp4";
  // videoA1.style.display = 'none';
  // videoA1.muted = true; 
  // videoA1.loop = true; 
  // document.body.appendChild(videoA1); 
  // var vTextureA1 = new THREE.VideoTexture(videoA1);
  // vTextureA1.minFilter = THREE.LinearFilter;
  // vTextureA1.magFilter = THREE.LinearFilter;
  // vTextureA1.format = THREE.RGBAFormat; 

  // VIDEO A2
  var videoA2 = document.createElement('video');
  videoA2.src = "./video/cinematic/BF_A2.mp4";
  videoA2.style.display = 'none';
  videoA2.muted = true; 
  videoA2.loop = true; 
  videoA2.volume = 0.1;
  document.body.appendChild(videoA2); 
  var vTextureA2 = new THREE.VideoTexture(videoA2);
  vTextureA2.minFilter = THREE.LinearFilter;
  vTextureA2.magFilter = THREE.LinearFilter;
  vTextureA2.format = THREE.RGBAFormat;  

  // VIDEO A3
  // var videoA3 = document.createElement('video');
  // videoA3.src = "./video/cinematic/BF_A3.mp4";
  // videoA3.style.display = 'none';
  // videoA3.muted = true; 
  // videoA3.loop = true; 
  // document.body.appendChild(videoA3); 
  // var vTextureA3 = new THREE.VideoTexture(videoA3);
  // vTextureA3.minFilter = THREE.LinearFilter;
  // vTextureA3.magFilter = THREE.LinearFilter;
  // vTextureA3.format = THREE.RGBAFormat;  

  // Crea un array per memorizzare i tuoi video
  var videos = [/*videoA1,*/ videoA2/*, videoA3*/]; 

  // Contatore per tenere traccia dei video pronti per la riproduzione
  var videosReady = 0;

  // Aggiungi un listener per l'evento 'loadeddata' a ciascun video
  for (var i = 0; i < videos.length; i++) {
      videos[i].addEventListener('loadeddata', function() {
          videosReady++;

          // Se tutti i video sono pronti, avvia la riproduzione
          if (videosReady === videos.length) {
              for (var j = 0; j < videos.length; j++) {
                  videos[j].play();
              }
          }
      });

      // Carica il video
      videos[i].load();
  }

  // Ottieni il riferimento al tuo pulsante
  // var playButton = document.querySelector('#btn-camera button');

  // // Aggiungi un listener per l'evento 'click' al pulsante
  // playButton.addEventListener('click', function() {
  //     // Avvia tutti e tre i video
  //     videoA1.play();
  //     videoA2.play();
  //     videoA3.play();
  // });

  // var pauseButton = document.querySelector('#btn-pause button');

  // Aggiungi un listener per l'evento 'click' al pulsante di pausa
  // pauseButton.addEventListener('click', function() {
  //     // Metti in pausa tutti e tre i video
  //     videoA1.pause();
  //     videoA2.pause();
  //     videoA3.pause();
  // });

  // let audioButton = document.querySelector('#btn-audio button');
  // let isMuted = false;

  // audioButton.addEventListener('click', function() {
  //     if (isMuted) {
  //         videoA2.muted = false;
  //     } else {
  //         videoA2.muted = true;
  //     }
  //     // Cambiamo lo stato
  //     isMuted = !isMuted;
  // });
  
  // MATERIALS
  // const material = new THREE.MeshPhysicalMaterial({
  //   color: 0x000000,
  //   map: TextureV1,       
  // }); 

  const materialA1 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: TextureV1,       
  }); 

  const materialA2 = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    //map: TextureV2,       
  }); 

  const materialA3 = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    //map: TextureV3,       
  }); 

  const materialA4 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: TextureV4,       
  }); 

  const materialA5 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: TextureV5,       
  }); 

  const materialA6 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: TextureV6,       
  }); 

  const materialA7 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: TextureV7,       
  }); 

  const material2 = new THREE.MeshPhysicalMaterial({
    color: 0x080808, 
    roughness: 0.5,
    metalness: 0,  
    //bumpMap: uvPaper,
    //bumpScale: 0.05,
  });

  const material3 = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,               
  });
  
  //SALA  
  const h = 1.2; //altezza sala  

  // SINISTRA 1
  const gParteSinistra1 = new THREE.BoxGeometry(0.1,h,3.609);
  let pSinistra1 = new THREE.Mesh( gParteSinistra1, materialA1);
  pSinistra1.position.set(-(4.88/2), h/2, (3.709-(3.509/4)));  
  //scene.add(pSinistra1);
  // SINISTRA 2
  const gParteSinistra2 = new THREE.BoxGeometry(1.166,h,0.1);
  let pSinistra2 = new THREE.Mesh( gParteSinistra2, materialA2);
  pSinistra2.position.set(-((4.88+1.05)/2), h/2, 1.054 );  
  scene.add(pSinistra2);
  // SINISTRA 3
  const gParteSinistra3 = new THREE.BoxGeometry(1.166,h,0.1);
  let pSinistra3 = new THREE.Mesh( gParteSinistra3, materialA3);
  pSinistra3.position.set(-((4.88+1.166)/2), h/2, 0);  
  scene.add(pSinistra3);
  // SINISTRA 4
  const gParteSinistra4 = new THREE.BoxGeometry(0.1,h,1.056);
  let pSinistra4 = new THREE.Mesh( gParteSinistra4, materialA4);
  pSinistra4.position.set(-((4.88+(1.05*2))/2), h/2, (1.056/2));  
  scene.add(pSinistra4);

  // SINISTRA 5
  const gParteSinistra5 = new THREE.BoxGeometry(0.1,h,4.682);
  let pSinistra5 = new THREE.Mesh( gParteSinistra5, materialA5);
  pSinistra5.position.set(-(4.88/2), h/2, -(4.541/2));  
  //pSinistra5.rotation.set(0,Math.PI, 0);
  scene.add(pSinistra5);  

  //FRONTALE
  const gPareteFrontale = new THREE.BoxGeometry( 4.82, h, 0.1 );
  let pFrontale = new THREE.Mesh( gPareteFrontale, materialA6);
  pFrontale.position.set( 0, h/2, -(9/2) ); /*( 0, h/2, -(9.245/2) ); */  
  scene.add(pFrontale);

  // DESTRA
  const gParteDestra = new THREE.BoxGeometry(0.1,h,9.245);
  let pDestra = new THREE.Mesh( gParteDestra, materialA7);
  pDestra.position.set( (4.96/2),h/2,-0.05);  /*( (4.82/2),h/2,0.1);  */
  scene.add(pDestra);

  // PAVIMENTO
  const gPavimento = new THREE.BoxGeometry( 8, 0.1, 10.245, );
  let pavimento = new THREE.Mesh( gPavimento, material2);
  pavimento.position.set( 0, -0.05, 0 );
  pavimento.receiveShadow = true;
  scene.add(pavimento);

  // TETTO
  const tetto = pavimento.clone();
  tetto.position.set(0,(h+0.1),0);

  const gCopertura = new THREE.BoxGeometry(4,h+0.1,0.1);
  let copertura = new THREE.Mesh(gCopertura, material2);
  copertura.position.set(4.3, h/2, 4.75);
  let coperturaS = copertura.clone();
  coperturaS.position.set(-4.3, h/2, 4.75)
  //scene.add(copertura, coperturaS);

  let sala = new THREE.Group();
  sala.add(pDestra, pSinistra1, pSinistra2, pSinistra3, pSinistra4, pSinistra5, pFrontale, pavimento, tetto, copertura, coperturaS );
  sala.position.set(0,-5,-40);
  sala.scale.set(10,10,10);  
  //scene.add(sala);

  const gColonna = new THREE.CylinderGeometry(0.4,0.4,12,16);
  let colonna1 = new THREE.Mesh(gColonna, material2);
  colonna1.position.set(-14,-4, 31);
  colonna1.castShadow = true; //default is false
  colonna1.receiveShadow = true;


  let colonna1a = colonna1.clone();
  colonna1a.position.set(-14,-4, 28);
  let colonne2 = new THREE.Group();
  colonne2.add(colonna1,colonna1a);
  let colonne2a = colonne2.clone();
  colonne2a.position.set(0,0,-18);
  let colonne4 = new THREE.Group();
  colonne4.add(colonne2, colonne2a);
  let colonne4a = colonne4.clone();
  colonne4a.position.set(0,0,-32);  
  let colonne8 = new THREE.Group();  
  colonne8.add(colonne4, colonne4a);
  let colonne8a = colonne8.clone();
  colonne8a.position.set(28,0,0);
  let colonne16 = new THREE.Group();
  colonne16.add(colonne8, colonne8a);
  colonne16.position.set(0,5,-40);
  scene.add(colonne16);

  let room = new THREE.Group();
  room.add(sala, colonne16);
  room.position.set(0,0,50);
  scene.add(room);

  // HUMANS 1
  const loaderH1 = new GLTFLoader();
  loaderH1.load(    
    './3d/humans/Low_person_1.glb',
    function (glt) {
      const human1 = glt.scene;
      human1.position.set( 2, -5, 10  );
      human1.rotation.set(0, Math.PI/2, 0 );      
      human1.scale.set(6,6,6);        
      human1.traverse(function (node) {
        if (node.isMesh) {
          const material = new THREE.MeshPhysicalMaterial({
            color: 0X666666,
            roughness: 0.5,
          });   
          node.material = material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });   
      scene.add(human1);        
      human1.castShadow = true; 
      human1.receiveShadow = true;       
    },       
    undefined, 
    function (error) {
      console.error(error);      
    }   
  );


    // HUMANS 2
    const loaderH2 = new GLTFLoader();
    loaderH2.load(    
      './3d/humans/Low_person_2.glb',
      function (glt) {
        const human2 = glt.scene;
        human2.position.set( 10, -5, -5  );
        human2.rotation.set(0, Math.PI/2, 0 );      
        human2.scale.set(6,6,6);        
        human2.traverse(function (node) {
          if (node.isMesh) {
            const material = new THREE.MeshPhysicalMaterial({
              color: 0X666666,
              roughness: 0.5,
            });   
            node.material = material;
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });   
        scene.add(human2);        
        human2.castShadow = true; 
        human2.receiveShadow = true;       
      },       
      undefined, 
      function (error) {
        console.error(error);      
      }   
    );


    // HUMANS 3
    const loaderH3 = new GLTFLoader();
    loaderH2.load(    
      './3d/humans/Low_person_3.glb',
      function (glt) {
        const human2 = glt.scene;
        human2.position.set( -10, -5, 0  );
        human2.rotation.set(0, Math.PI, 0 );      
        human2.scale.set(6,6,6);        
        human2.traverse(function (node) {
          if (node.isMesh) {
            const material = new THREE.MeshPhysicalMaterial({
              color: 0X666666,
              roughness: 0.5,
            });   
            node.material = material;
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });   
        scene.add(human2);        
        human2.castShadow = true; 
        human2.receiveShadow = true;       
      },       
      undefined, 
      function (error) {
        console.error(error);      
      }   
    );

  // FEMALE    
  // const loaderHousewife = new OBJLoader();
  // let housewife;
     
  // LOAD A RESOURCE
  // loaderHousewife.load('3d/humans/housewife.obj',
  //   function ( objHousewife ) {
  //     objHousewife.position.set( -5, -4, -10 );
  //     objHousewife.rotation.set( 0, Math.PI/2.2, 0 );      
  //     try{
  //       const matHousewife = new THREE.MeshPhysicalMaterial({
  //        color: 0x555555,          
  //         //clearcoat: 1.0,
  //         //clearcoatRoughness: 0.1                  
  //       })     
        
  //       objHousewife.children[0].material=matHousewife;
  //     }catch(e){
  //       console.log(e);
  //     }
  //     housewife=objHousewife;     
  //     console.log( 'body was loaded', housewife );
  //     housewife.position.set(0,-5,10);
  //     housewife.rotation.set(0, Math.PI,0); 
  //     housewife.castShadow = true;     
  //     scene.add( housewife );
  //     let hh = 0.08;

  //     housewife.scale.set( hh, hh, hh);        
     
  //     },
  //     // called when loading is in progresses
  //     function ( xhr ) {
  //       console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  //     },
  //   // called when loading has errors
  //   function ( error ) {
  //     console.log( 'An error happened' );
  //   }
  // );

  animateScene();  
 
};