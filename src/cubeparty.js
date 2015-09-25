'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
var loadingOn = true;
var disableSound = true;
var musicControl;
var musicUrl = 'res/jam.mp3';
var soundVolume = disableSound ? 0 : 100;
function init() {
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer({antialias:false,});
		renderer.autoClearColor = 0x000000;
		renderer.autoClear = true;
	} else {
		Detector.addGetWebGLMessage();
		return true;
	}
	loadingManager = new THREE.LoadingManager(
		function() { // onLoad
			console.log('All resources loaded, ready to rock \\m/');
			loadingOn = false; 
		},
		function (item, loaded, total) { // onProgress
			console.log('Completed ' + item, loaded + '/' + total);
		},
		function () { // onError
			console.error('Failed to load resources');
		}
	);
	loadingManager.itemStart('init');
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	stats = new Stats();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('container').appendChild(renderer.domElement);
	// put a camera in the scene
	camera.position.set(0, 0, 1500);
	camera.lookAt(scene.position);
	scene.add(camera);
	THREEx.WindowResize.bind(renderer, camera);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
	tlMain = new TimelineLite({
		paused: true,
		useFrames: false,
		});
	loadingManager.itemStart('loadingAnim');
	var LoadingAnim = createLoadingAnim({
		onCompleted:startShow,
		get loading() { return loadingOn; }
	});
	animate();
	createScene();
	loadingManager.itemEnd('init');
}
function soundManagerReady() {
	loadingManager.itemEnd('SoundManager');
	loadingManager.itemStart(musicUrl);
	if (!soundManager.canPlayURL(musicUrl)) {
		console.error('Music format error on ' + musicUrl);
	}
	musicControl = soundManager.createSound({
		url: musicUrl,
		volume: soundVolume,
		autoLoad: true,
		autoPlay: false,
		onLoad: musicReady,
	});
}
function musicReady() {
	console.log('Music ready', musicControl);
	loadingManager.itemEnd(musicUrl);
}
function createScene() {
	loadingManager.itemStart('createScene');
	loadingManager.itemStart('SoundManager');
	soundManager.setup({
		url: '',
		onready: function() {
			soundManagerReady();
		},
		preferFlash: false,
		debugMode: false,
	});
	// Push effects to display list
	effects.push(createKnot('blueknot', 0xffaffa));
	effects.push(createKnot('redknot', 0x00fafa));
	// ---
	var enabledEffects = effects.filter(function(el,ind,arr) {
			return el.enabled === true; }
		);
	effects = enabledEffects;
	for (var i = 0; i < effects.length; ++i) {
		if (effects[i].timeline != null) {
			tlScenes.push(effects[i].timeline);
		 };
	}
	// Setup control timeline
	tlMain.set(scene, {visible:true, immediateRender:false}, "0");
	tlMain.call(function(){tlScenes[0].play()}, null, null, "0");
	tlMain.call(function(){tlScenes[1].play()}, null, null, "2");
	tlMain.call(stopShow, null, null, '+=' + tlScenes[1].endTime());
	loadingManager.itemEnd('createScene');
}
function startShow() {
	loadingManager.itemEnd('loadingAnim');
	loadingManager.itemEnd('initialization...');
	musicControl.play();
	tlMain.play(0);
	console.log('Rock on!');
}
function stopShow() {
	musicControl.stop();
	tlMain.stop
	console.log('Thank you for watching...');
}
function animate(timestamp) {
	requestAnimationFrame(animate); // Tries to animate@60 fps
	renderer.render(scene, camera);
	stats.update(); // Comment this on release
}
