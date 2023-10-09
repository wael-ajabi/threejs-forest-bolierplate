/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';



///////////////////////////////////////////////////////////////////////////
///// Loading Manager
const manager = new THREE.LoadingManager();
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    // Calculate the percentage of items loaded
    const progress = (itemsLoaded / itemsTotal) * 100;
    console.log(`Loading: ${progress.toFixed(2)}%`);
    // Update your loading UI/Screen with the progress here
};

manager.onLoad = () => {
    console.log('All assets loaded!');
    document.getElementsByClassName('loading-screen')[0].style.display='none';

    introAnimation()

};


/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader(manager)
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div')
container.classList.add("three");
document.body.appendChild(container)

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true }) // turn on antialias
renderer.setPixelRatio(window.devicePixelRatio);//set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(-1155.1769117242054,149.3672569702152,-12.347546346681437);
// camera.position.set(-1155.1769117242054,149.3672569702152,-12.347546346681437);

camera.lookAt(0, 0, 0);
scene.add(camera)

/////////////////////////////////////////////////////////////////////////
//////////HDRI

const pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();
const hdriLoader = new EXRLoader(manager);
hdriLoader.load( 'models/gltf/Modern_Atrium.exr', function ( texture ) {
    const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
    // scene.background = envMap;
    scene.environment = envMap;
    texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;

    texture.dispose();
    pmremGenerator.dispose();
});


/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
function adjustCameraFOV() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    camera.aspect = w / h;

    if (w < h) {  // Portrait mode
        camera.fov = 80; // Adjust this value based on your needs
    } else {      // Landscape mode

        const width = window.innerWidth
        const height = window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    
        renderer.setSize(width, height)
        renderer.setPixelRatio(2)

    }
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
}

window.addEventListener('resize', adjustCameraFOV);
adjustCameraFOV(); // Call once to set the initial state
/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambient);
const sunLight = new THREE.DirectionalLight(0xffffff, 8.5);
sunLight.position.set(-69, 44, 14);
sunLight.castShadow = true;

// Configure shadow properties
sunLight.shadow.mapSize.width = 1024; // Default is 512
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5; // Default
sunLight.shadow.camera.far = 500;
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
const spotLight = new THREE.SpotLight(0xffffff); // white light
spotLight.position.set(-400, 230, 500); // x, y, z coordinates where the light is coming from
spotLight.target.position.set(-577,  -4187, 1699.40728); // x, y, z coordinates where the light is coming from
spotLight.angle = Math.PI / 10; // Cone angle in radians (default is Math.PI/3)
spotLight.penumbra = 0.1; // Percentage of the spotlight cone that is attenuated due to penumbra. Takes values between 0 and 1.
spotLight.intensity = 2000; // Brightness of the light
spotLight.distance = 300; // Maximum range of the spotlight, 0 (default) means infinite distance
spotLight.decay = 1; // The amount the light dims along the distance of the light. Default is 1, which means no decay.
spotLight.castShadow = true;

// Configure shadow properties
spotLight.shadow.mapSize.width = 2048; // Default is 512
spotLight.shadow.mapSize.height = 2048;

spotLight.shadow.camera.near = 0.5; // Default
spotLight.shadow.camera.far = 500;
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const helper = new THREE.CameraHelper(sunLight.shadow.camera);
scene.add(helper);

/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load('models/gltf/test1.glb', function (gltf) {

    gltf.scene.traverse( child => {
        if ( child.material ) {if(child){child.castShadow= true; child.receiveShadow=true;}}
        if ( child.material ) {if(child.name==="Cube.2"){child.castShadow= true; child.receiveShadow=true};}
        if ( child.material ) {if(child.name==="Cube.7"){child.castShadow= true;};}
        if ( child.material ) {if(child.name==="Cube.5-Mure"){child.castShadow= true;};}
        if ( child.material ) {if(child.name==="Plane"){console.log(child.material.metalness= 0.5,  // Values between 0 and 1 to control metalness
        child.material.roughness= 0);};}

        
    
    
    } );
    scene.add(gltf.scene);
});

/////////////////////////////////////////////////////////////////////////
//// DEFINE ORBIT CONTROLS LIMITS
function setOrbitControlsLimits(){
    // controls.enableDamping = true
    // controls.dampingFactor = 0.04
    // controls.minDistance = 35
    // controls.maxDistance = 60
    controls.enableRotate = false
    controls.enableZoom = false
    // onMouvement=true
    // controls.maxPolarAngle = Math.PI /2.5
}

/////////////////////////////////////////////////////////////////////////
//// Scroll-based Animation Logic
// Initialize the start and end points



// let progress = 0;
// let currentSegment = 0;
// var modal = document.getElementById("myModal");

// // Get the <span> element that closes the modal
// let popupClosed = true; // Flag to track whether the user closed the popup
// var span = document.getElementsByClassName("close")[0];

// span.onclick=function () {
//     popupClosed = false; // Set the flag to indicate that the popup is closed
//     console.log('testttttttttttttttttttttttttttttt');
//     modal.style.display = "none";
//     document.body.style.overflow = '';
//     window.addEventListener('wheel', scrollHandler); // This will reactivate scrolling
    
    
// }
// Assuming you have a close button in your HTML

// if (span) {
//     span.addEventListener("click", closePopup);
// }
// const triggerPosition = new THREE.Vector3(-412.9419463357208,126.55531098758006,310.45690277806756);
// let cameraPositionPrev = new THREE.Vector3(); // Store the previous camera position

// function checkTriggerPosition(cameraPosition) {

//     const distance = cameraPosition.distanceTo(triggerPosition);

//     // Define a threshold for when the popup should appear
//     const threshold = 5; // Adjust this value as needed
  
//     // Calculate the direction of camera movement

//         // Show the popup if the camera is close to the trigger position and moving forward
//         if (distance < threshold&&popupClosed) {

//                 modal.style.display = "block";
//                 window.removeEventListener('wheel', scrollHandler);
                

//                 console.log(popupClosed);
      
//     // Custom logic to execute when the fourth point is reached
// }else{
//    if(distance < threshold) popupClosed=true;
//    .0
   
// }

// }
//     let maxSegment = points.length ; // Last accessible segment
//     let minSegment = 0; // First segment
    
    // function scrollHandler(event) {

        
    //         if (event.deltaY > 0) {
    //             progress -= 0.1;
    //         } else {
    //             progress += 0.1;
    //         }
        
    //         if (progress >= 1) {
    //             progress = 0;
    //             currentSegment++;
    //         } else if (progress < 0) {
    //             progress = 1;
    //             currentSegment--;
    //         }
        
    //         // Prevent scrolling beyond the first and last points.
    //         if (currentSegment > maxSegment) {
    //             currentSegment = maxSegment;
    //             progress = 1;
    //             return;
    //         }
    //         if (currentSegment < minSegment) {
    //             currentSegment = minSegment;
    //             progress = 0;
    //             return;
    //         }
    
    //     const start = points[currentSegment];
    //     const end = points[currentSegment + 1];
    // const startTarget = targetPoints[currentSegment];
    // const endTarget = targetPoints[currentSegment + 1];

    // const x = start.x + progress * (end.x - start.x);
    // const y = start.y + progress * (end.y - start.y);
    // const z = start.z + progress * (end.z - start.z);

    // const tx = startTarget.x + progress * (endTarget.x - startTarget.x);
    // const ty = startTarget.y + progress * (endTarget.y - startTarget.y);
    // const tz = startTarget.z + progress * (endTarget.z - startTarget.z);
    // const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2) + Math.pow(end.z - start.z, 2));
    // const duration = distance * 0.5;  // Change 0.5 to whatever factor makes it feel right

    const points = [
        {x: -896.3635793074993, y: 109.12508552265311, z: -4.112903550740432},
        {x: -420.22053031091684, y: 112.82558516828459, z: 302.2956398023865},
        {x: -77.59535595419545, y: 107.4651531946964, z: -4.778651686478611},
        {x: 264.88672931671096, y: 104.53754810932516, z: -26.334328984753995},
        {x: 607.9465878449827, y: 93.3392293365437, z: 12.648415195078083},
        {x: 556.8130387738962, y: 107.02180637004543, z: -293.12587375627004},
        
    
        
    
    ];
    
    const targetPoints = [
        {  x: 3.6406308594095727, y: 60.09445705063549, z: -0.5606972660741589 },
        {x: -406.29433389913476, y: 77.77867834138249, z: 1157.743250698177},
        {x: -72.81996761199011, y: 101.9061750179262, z: -296.30214516804745},
        {x: 265.4281382980515, y: 98.9785699325562, z: 265.22777153901404},
        {x: 1464.038094840064, y: 111.0842607048724, z: 10.349475302862574},
        {x: 548.5657556822914, y: 75.33976318078035, z: -1105.9313967510273},
    
       
    ];

    let currentIndexPoints= 0 
    let currentIndexTargets= 0 
    
    var scrollableElement = document.body; //document.getElementById('scrollableElement');
    let onMouvement=false
    scrollableElement.addEventListener('wheel', checkScrollDirection);
    // controls: Vector3 {x: 3.6406308594095727, y: 60.09445705063549, z: -0.5606972660741589}    camera: Vector3 {x: -896.3635793074993, y: 109.12508552265311, z: -4.112903550740432}
    function introAnimation() {
        controls.enabled = false //disable orbit controls to animate the camera
        
        new TWEEN.Tween(camera.position).to({ // from camera position
            x: -896.3635793074993, y: 109.12508552265311, z: -4.112903550740432
        }, 7500) // time take to animate
        .easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
        .onComplete(function () { //on finish animation
            controls.enabled = true //enable orbit controls
            setOrbitControlsLimits() //enable controls limits
            TWEEN.remove(this) // remove the animation from memory
            window.addEventListener('wheel', checkScrollDirection);
            document.getElementById('scroll').style.display='block'

        })
        new TWEEN.Tween(controls.target).to({
            x: 3.6406308594095727, y: 60.09445705063549, z: -0.5606972660741589
        }, 7500).easing(TWEEN.Easing.Cubic.InOut).start();
    }


    ////// adding the popup logic
    var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

span.onclick=function () {
    modal.style.display = "none";
    document.getElementById('scroll').style.display='block'
    onMouvement=false
    window.addEventListener('wheel', checkScrollDirection);
    
    
}
// Assuming you have a close button in your HTML

// if (span) {
//     span.addEventListener("click", closePopup);
// }







    function checkScrollDirection(event) {
        if(onMouvement===true){return}
      if (checkScrollDirectionIsDown(event)) {
        document.getElementById('scroll').style.display='none'
        currentIndexTargets++;
        currentIndexPoints++;
        onMouvement=true
       if (currentIndexPoints>=points.length){
        currentIndexPoints= points.length-1;
        currentIndexTargets= points.length-1;
        return
       }  
    new TWEEN.Tween(camera.position).to({
      x:points[currentIndexPoints].x,y:points[currentIndexPoints].y,z:points[currentIndexPoints].z
    }, 5000).easing(TWEEN.Easing.Exponential.Out).start().onComplete(function() {
        document.getElementById('scroll').style.display='none'
        onMouvement=true
        modal.style.display = "block";
        window.removeEventListener('wheel', checkScrollDirection);

        scrollableElement.removeEventListener('wheel',checkScrollDirection);
        });
    // .onComplete(function() {
    //     if (currentSegment === 4) {  
    //         onFourthPointReached();
    //     }
    // })
    new TWEEN.Tween(controls.target).to({
        x:targetPoints[currentIndexTargets].x,y:targetPoints[currentIndexTargets].y,z:targetPoints[currentIndexTargets].z
    }, 3000).easing(TWEEN.Easing.Linear.None).start();

        
      } else {
        document.getElementById('scroll').style.display='none'
        currentIndexTargets--;
        currentIndexPoints--;
        onMouvement=true
       if (currentIndexPoints<=points.length){
        currentIndexPoints= points.length-1;
        currentIndexTargets= points.length-1;
        return
       }  
    new TWEEN.Tween(camera.position).to({
      x:points[currentIndexPoints].x,y:points[currentIndexPoints].y,z:points[currentIndexPoints].z
    }, 5000).easing(TWEEN.Easing.Exponential.Out).start().onComplete(function() {
        document.getElementById('scroll').style.display='none'
        onMouvement=true
        modal.style.display = "block";
        window.removeEventListener('wheel', checkScrollDirection);

        scrollableElement.removeEventListener('wheel',checkScrollDirection);
        });
    // .onComplete(function() {
    //     if (currentSegment === 4) {  
    //         onFourthPointReached();
    //     }
    // })
    new TWEEN.Tween(controls.target).to({
        x:targetPoints[currentIndexTargets].x,y:targetPoints[currentIndexTargets].y,z:targetPoints[currentIndexTargets].z
    }, 3000).easing(TWEEN.Easing.Linear.None).start();

        
            }
    }
    
    function checkScrollDirectionIsDown(event) {
      if (event.wheelDelta) {
        return event.wheelDelta < 0;
      }
      return event.deltaY > 0;
    }
 
 
 
 
 


// };
///////////////////////////////////////////
////////////////touch detection event
let startY;

// Listen for the touch start event
document.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
}, false);

// Listen for the touch end event
document.addEventListener('touchend', (event) => {
    const endY = event.changedTouches[0].clientY;

    if (startY - endY > 10) {  // 10 is a threshold value, you can adjust it
        // Detected swipe up (equivalent to mouse wheel scroll up)
        checkScrollDirection({ deltaY: 1 });
    } else if (endY - startY > 10) { // Same threshold value as above
        // Detected swipe down (equivalent to mouse wheel scroll down)
        checkScrollDirection({ deltaY: -1 });
    }
}, false);

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION
function rendeLoop() {
    // const cameraPosition = camera.position;
    // console.log(popupClosed);
    // Check the trigger position and update the popup display
    // checkTriggerPosition(cameraPosition);
  
    TWEEN.update()
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(rendeLoop)
    // console.log("controls:",controls.target)
    // console.log("camera:",camera.position)
    // console.log(currentIndexPoints);
    // console.log(onMouvement);
}

setOrbitControlsLimits(); // Set initial orbit control limits
rendeLoop()
const gui = new GUI()

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
spotLight.angle = Math.PI / 4; // Cone angle in radians (default is Math.PI/3)

//////////////////////////////////////////////////
//// GUI CONFIG
gui.add(sunLight, 'intensity').min(0).max(10).step(0.0001).name('Dir intensity')
gui.add(sunLight.position, 'x').min(-100).max(100).step(0.00001).name('Dir X pos')
gui.add(sunLight.position, 'y').min(0).max(100).step(0.00001).name('Dir Y pos')
gui.add(sunLight.position, 'z').min(-100).max(100).step(0.00001).name('Dir Z pos')
gui.add(spotLight.position, 'x').min(-5000).max(5000).step(0.00001).name('spotLight Z pos')
gui.add(spotLight.position, 'y').min(-5000).max(5000).step(0.00001).name('spotLight Z pos')
gui.add(spotLight.position, 'z').min(-5000).max(5000).step(0.00001).name('spotLight Z pos')
gui.add(spotLight.target.position, 'x').min(-5000).max(5000).step(0.00001).name('spotLight x rot')
gui.add(spotLight.target.position, 'y').min(-10000).max(10000).step(0.00001).name('spotLight y rot')
gui.add(spotLight.target.position, 'z').min(-5000).max(5000).step(0.00001).name('spotLight Z rot')
gui.addColor(params,'color').name('Dir color').onChange(update)
gui.addColor(params,'color2').name('Amb color').onChange(update)
gui.add(ambient, 'intensity').min(0).max(10).step(0.001).name('Amb intensity')
gui.addColor(params,'color3').name('BG color').onChange(update)
gui.add(camera.position, 'x').min(-100).max(100).step(0.00001).name('Dir camera  x')
gui.add(camera.position, 'y').min(-100).max(100).step(0.00001).name('Dir camera  y')
gui.add(camera.position, 'z').min(-100).max(100).step(0.00001).name('Dir camera  z')
gui.add(controls.target, 'x').min(-100).max(100000).step(0.00001).name('Dir controls  rot x')
gui.add(controls.target, 'y').min(-100).max(100000).step(0.00001).name('Dir controls  rot y')
gui.add(controls.target, 'z').min(-100).max(100000).step(0.00001).name('Dir controls  rot z')

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
gui.closed=true;
document.addEventListener('mousemove', (event) => {
    event.preventDefault()

}, false)