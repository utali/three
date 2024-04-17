import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const init = () => {
  const mixers = [];
  let bird, startTime = 0;
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const urls = [
    "/img/posx.jpg",
    "/img/negx.jpg",
    "/img/posy.jpg",
    "/img/negy.jpg",
    "/img/posz.jpg",
    "/img/negz.jpg",
  ];
  const cubeLoader = new THREE.CubeTextureLoader();
  scene.background = cubeLoader.load(urls);

  //增加环境光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  //增加点光源
  const pointLight = new THREE.PointLight(0xffffff, 5);
  pointLight.position.set(-500, 1000, 100);
  scene.add(pointLight);

  // scene.add(new THREE.GridHelper(800, 20));
  // 创建曲线
  const points = [
    new THREE.Vector3(10, 20, -70),
    new THREE.Vector3(-5, 25, -150),
    new THREE.Vector3(-50, 50, -200),
    new THREE.Vector3(-100, 60, -250),
    new THREE.Vector3(-200, 70, -250),
    new THREE.Vector3(-300, 80, -200),
    new THREE.Vector3(-400, 90, -150),
    new THREE.Vector3(-200, 70, -50),
    new THREE.Vector3(-100, 50, -20),
    // new THREE.Vector3(-70, 50, -20),
    new THREE.Vector3(-50, 20, 10),
    new THREE.Vector3(0, 10, 0),
  ];
  const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);

  // const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));
  // const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  // const curveObj = new THREE.Line(geometry, material);
  // scene.add(curveObj);

  const loader = new GLTFLoader();
  loader.load(
    "/models/Flamingo.glb",
    function (gltf) {
      const mesh = gltf.scene.children[0];

      const s = 0.35;
      mesh.scale.set(s, s, s);
      mesh.position.set(10, 20, -70);
      mesh.rotation.set(0, 10, 0);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      scene.add(mesh);
      bird = mesh;

      const mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(1).play();
      mixers.push(mixer);
    },
    undefined,
    function (err) {
      console.log("error", err);
    }
  );

  const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.5,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(10, 0, 10);
  controls.update();

  document.body.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
  }

  function birdAnimation() {
    if (!bird) return;
    // 创建Follower
		let follower = bird;
		scene.add(follower);
		const path = new THREE.Path(curve.getPoints(200)); // 将曲线转换成路径
		follower.position.copy(path.getPointAt(0));// 将follower的位置设置在初始位置
		follower.lookAt(path.getPointAt(0.1)); // 设定为朝向曲线路径的第二个点的方向

    const curveLength = curve.getLength();

		const totalTime = curveLength / 0.2 // 这里的1是速度
		startTime += 1;
		const moveTime = startTime % totalTime;
		const distance = (moveTime * 2) % curveLength; //应该移动的距离
		const planePosition = curve.getPointAt(distance / curveLength)//获取follower应该在曲线上的位置
		follower.position.copy(planePosition); // 更新follower的位置
		const lookAhead = 0.1; // 指定follower朝向曲线路径前方的距离（可根据需要调整）
		const target = curve.getPointAt((distance + lookAhead) / curveLength); // 获取follower朝向的目标点
		follower.lookAt(target); // 更新follower的朝向
  }

  function render() {
    const delta = clock.getDelta();

    for (let i = 0; i < mixers.length; i++) {
      mixers[i].update(delta);
    }
    birdAnimation();
    renderer.render(scene, camera);
  }

  animate();
};

init();
