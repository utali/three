import * as THREE from 'three';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//增加环境光源
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
//增加点光源
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(-500, 1000, 100);
scene.add(pointLight);

var birdGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var birdMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });

var birds = [];
for (var i = 0; i < 3; i++) {
  var bird = new THREE.Mesh(birdGeometry, birdMaterial);
  bird.position.x = Math.random() * 10 - 5;
  bird.position.y = Math.random() * 10 - 5;
  bird.position.z = Math.random() * 10 - 5;
  bird.rotation.x = Math.random() * Math.PI * 2;
  bird.rotation.y = Math.random() * Math.PI * 2;
  bird.rotation.z = Math.random() * Math.PI * 2;
  scene.add(bird);
  birds.push(bird);
}

function animate() {
  requestAnimationFrame(animate);
  for (var i = 0; i < birds.length; i++) {
    bird.rotation.x += 0.01;
    bird.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

animate();