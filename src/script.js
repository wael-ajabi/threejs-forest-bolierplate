// IMPORTS
import './main.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
// import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
// DRACO LOADER SETUP
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)
// ... [Rest of your imports and initializations]

setTimeout(() => {
    document.getElementsByClassName('loader-container')[0].style.display = "none";
    document.getElementsByTagName('body').overflow="";
  }, 10000);
// CREATE SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

// RENDERER CONFIGURATION
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// CAMERA CONFIGURATION
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(-1155.1769117242054,149.3672569702152,-12.347546346681437);
// camera.position.set(-1155.1769117242054,149.3672569702152,-12.347546346681437);

camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement)
// controls.target.set(900, 0, 20)
// controls.enableDamping = true
// controls.dampingFactor = 0.04
// controls.minDistance = 35
// controls.maxDistance = 60
// controls.enableRotate = true
// controls.enableZoom = true
// controls.maxPolarAngle = Math.PI /2.5
// REGISTER GSAP's ScrollTrigger

var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Function to open the modal
function showPopup() {
    modal.style.display = "block";
    console.log("Attempting to show popup")
    document.body.style.overflow = 'hidden';


}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    document.body.style.overflow = '';
    ScrollTrigger.getById("waell").enable(false);
    ScrollTrigger.getById("wael").enable(false);

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;

gsap.registerPlugin(ScrollTrigger);

// Scroll container
const scrollContainer = document.querySelector('#scrollContainer');

const cameraPoints = [
    { x: -941.6832180422514, y: 114.85087869760511, z: 15.330062630509714 },
    { x: -800, y: 130, z: 20 },
    { x: -893.2064303394651 , y: 157.3826391382255, z: 435.586928857865 },
    { x: -782.0514250760889 , y: 128.37991420503292, z: 648.5289562810322 },
    { x: -757.2429783590289 , y: 150.7876438719656 , z: 620.3741822434362 },
    { x: -713.4582889904098 , y: 171.29676516103646, z: 646.3374486881113 },
];

const targetPoints = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 1866.40135 },
    { x: -786.8578223021165, y: 107.68997420909818, z: 1068.6810745513117 },
    { x: -716.466638519225 , y: 48.18128371221104 , z: 1562.7128916597087 },
    { x: -714.9586584642068, y: 165.66198044806592, z: 742.9016283341942 },
];
// Animate camera based on overall scroll progress
const cameraTimeline = gsap.timeline({
    scrollTrigger: {
        id:"wael",
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom", toggleActions: "play reset none reset",
        scrub: 10,
    }
});

cameraTimeline
    .to(camera.position, { duration: 1, x: cameraPoints[0].x, y: cameraPoints[0].y, z: cameraPoints[0].z, ease: 'none', 

    })
    .to(camera.position, { duration: 1, x: cameraPoints[1].x, y: cameraPoints[1].y, z: cameraPoints[1].z, ease: 'none',

    })
    .to(camera.position, { duration: 1, x: cameraPoints[2].x, y: cameraPoints[2].y, z: cameraPoints[2].z, ease: 'none',

    })
    .to(camera.position, { duration: 1, x: cameraPoints[3].x, y: cameraPoints[3].y, z: cameraPoints[3].z, ease: 'none',   onComplete: function() {
   
       
        ScrollTrigger.getById("wael").disable(false,false);

        
    }

    })
    .to(camera.position, { duration: 1, x: cameraPoints[4].x, y: cameraPoints[4].y, z: cameraPoints[4].z, ease: 'none',

    })
    // .to(camera.position, { duration: 1, x: cameraPoints[5].x, y: cameraPoints[5].y, z: cameraPoints[5].z, ease: 'none',

    // });
    const targetTimeline = gsap.timeline({
        scrollTrigger: {
            id:"waell",
            trigger: scrollContainer,
            start: "top top",
            end: "bottom bottom",
            scrub: 10,toggleActions: "play reset none reset",
            
        }
    });

targetTimeline
.to(controls.target, { duration: 1, x: targetPoints[0].x, y: targetPoints[0].y, z: targetPoints[0].z, ease: 'none', 

})
.to(controls.target, { duration: 1, x: targetPoints[1].x, y: targetPoints[1].y, z: targetPoints[1].z, ease: 'none',

})
.to(controls.target, { duration: 1, x: targetPoints[2].x, y: targetPoints[2].y, z: targetPoints[2].z, ease: 'none',

})
.to(controls.target, { duration: 1, x: targetPoints[3].x, y: targetPoints[3].y, z: targetPoints[3].z, ease: 'none',onComplete: function() {
   
        showPopup();
        ScrollTrigger.getById("waell").disable(false,false);

    
}

})
.to(controls.target, { duration: 1, x: targetPoints[4].x, y: targetPoints[4].y, z: targetPoints[4].z, ease: 'none',

})
// .to(controls.target, { duration: 1, x: targetPoints[5].x, y: targetPoints[5].y, z: targetPoints[5].z, ease: 'none',

// });

// HANDLE RESIZE
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(2);
});
function setOrbitControlsLimits(){
    controls.enableDamping = true
    controls.dampingFactor = 0.04
    controls.minDistance = 35
    controls.maxDistance = 60
    controls.enableRotate = true
    controls.enableZoom = true
    controls.maxPolarAngle = Math.PI /2.5
}
// LIGHTS SETUP
const ambient = new THREE.AmbientLight(0xffffff, 0.82);
scene.add(ambient);
const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96);
sunLight.position.set(-69, 44, 14);
scene.add(sunLight);

    // RectAreaLightUniformsLib.init();
    const color = 0xFFFFFF;
const intensity = 5;
const width = 12;
const height = 4;
const light = new THREE.RectAreaLight(color, intensity, width, height);
light.position.set(0, 10, 0);
light.rotation.x = THREE.MathUtils.degToRad(-90);
scene.add(light);
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
const gui = new GUI()

// LOADING GLB/GLTF MODEL



// RENDER LOOP
function renderLoop() {
    renderer.render(scene, camera);
    controls.update() // update orbit controls

    requestAnimationFrame(renderLoop);
}
renderLoop();



loader.load('models/gltf/untitled.glb', function (gltf) {
    gltf.scene.traverse( child => {

        if ( child.material ) {child.material.metalness = 0.7;
        
        }
    
    } );
    scene.add(gltf.scene);
});
// create parameters for GUI
var params = {color: sunLight.color.getHex(), color2: ambient.color.getHex(), color3: scene.background.getHex()}

// create a function to be called by GUI
const update = function () {
	var colorObj = new THREE.Color( params.color )
	var colorObj2 = new THREE.Color( params.color2 )
	var colorObj3 = new THREE.Color( params.color3 )
	sunLight.color.set(colorObj)
	ambient.color.set(colorObj2)
	scene.background.set(colorObj3)
}

//////////////////////////////////////////////////
//// GUI CONFIG
gui.add(sunLight, 'intensity').min(0).max(10).step(0.0001).name('Dir intensity')
gui.add(sunLight.position, 'x').min(-100).max(100).step(0.00001).name('Dir X pos')
gui.add(sunLight.position, 'y').min(0).max(100).step(0.00001).name('Dir Y pos')
gui.add(sunLight.position, 'z').min(-100).max(100).step(0.00001).name('Dir Z pos')
gui.add(camera.position, 'x').min(-100).max(100).step(0.00001).name('Dir camera  x')
gui.add(camera.position, 'y').min(-100).max(100).step(0.00001).name('Dir camera  y')
gui.add(camera.position, 'z').min(-100).max(100).step(0.00001).name('Dir camera  z')
gui.add(camera.rotation, 'x').min(-100).max(100).step(0.00001).name('Dir camera  rot x')
gui.add(camera.rotation, 'y').min(-100).max(100).step(0.00001).name('Dir camera  rot y')
gui.add(camera.rotation, 'z').min(-100).max(100).step(0.00001).name('Dir camera  rot z')
gui.add(controls.target, 'x').min(-100).max(100000).step(0.00001).name('Dir controls  rot x')
gui.add(controls.target, 'y').min(-100).max(100000).step(0.00001).name('Dir controls  rot y')
gui.add(controls.target, 'z').min(-100).max(100000).step(0.00001).name('Dir controls  rot z')
gui.addColor(params,'color').name('Dir color').onChange(update)
gui.addColor(params,'color2').name('Amb color').onChange(update)
gui.add(ambient, 'intensity').min(0).max(10).step(0.001).name('Amb intensity')
gui.addColor(params,'color3').name('BG color').onChange(update)

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
    event.preventDefault()

    // console.log("controls:",controls.target)
    // console.log("camera:",camera.position)

}, false)
gui.close()