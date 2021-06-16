import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

var scene,camera,renderer;
var line ,ground;
var pointCoordinates = [];
var shapes = [];

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,100);
    camera.position.z = 7;
    camera.lookAt(new THREE.Vector3());
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,3));
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.prepend(renderer.domElement);
}

function addGround(){
    var groundGeometry = new THREE.PlaneGeometry(50,50);
    var groundMaterial = new THREE.MeshBasicMaterial({color:"white"});
    ground = new THREE.Mesh(groundGeometry,groundMaterial);
    scene.add(ground);
}

function addGrid(){
    var grid = new THREE.GridHelper(15,50);
    grid.rotation.x = Math.PI/2;
    scene.add(grid);
}

const raycaster = new THREE.Raycaster();

function onClick( event ) {
    var mouse = new THREE.Vector2()
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse,camera);
    const intersects = raycaster.intersectObject(ground)[0];
    pointCoordinates.push(
        new THREE.Vector3(intersects.point.x,intersects.point.y,0)
    );

    if(line){
        scene.remove(line);
    }
    var lineGeometry = new THREE.BufferGeometry().setFromPoints(pointCoordinates);
    const lineMaterial = new THREE.LineBasicMaterial( { color: "green"} );
    line = new THREE.Line(lineGeometry,lineMaterial);
    scene.add(line);
}

function complete(){
    pointCoordinates.push(pointCoordinates[0]);

    if(line){
        scene.remove(line);
    }

    const customShape = new THREE.Shape(pointCoordinates);
    const extrudeSettings = { depth: 0.1, bevelEnabled: false};
    const customGeometry = new THREE.ExtrudeGeometry(customShape,extrudeSettings);
    const customMesh = new THREE.Mesh(customGeometry,new THREE.MeshBasicMaterial({color:"#e85b1e"}));
    scene.add(customMesh);
    shapes.push(customMesh);

    var lineGeometry = new THREE.BufferGeometry().setFromPoints(pointCoordinates);
    const lineMaterial = new THREE.LineBasicMaterial( { color: "black" } );
    var blackLine = new THREE.Line(lineGeometry,lineMaterial);
    scene.add(blackLine);
    shapes.push(blackLine);

    pointCoordinates = [];

}

function reset(){
    pointCoordinates = [];
    scene.remove(line);
    shapes.forEach((shape)=>{
        scene.remove(shape);
    })
}

function render(){
    renderer.render(scene,camera);
    requestAnimationFrame(render);
}

function resize(){
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}

init();
addGround();
addGrid();
render();
document.querySelector("canvas").addEventListener("click",onClick);
document.querySelector(".complete").addEventListener("click",complete);
document.querySelector(".reset").addEventListener("click",reset);
window.addEventListener("resize",resize);