'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
var loadingOn = true;
var musicOn = false;
var creatingScene = true;
var LoadingAnim;
var musicControl;
var maxJitter = 1200; // ms
var startOffset = 0;
var startTimeAbsolute;
var startTimeGameTime;
var frameRateLimit = 60;
var musicUrl = 'res/jam.mp3';
var soundVolume = 0;  // for debugging 

function init() {
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer({antialias:false,});
		renderer.autoClearColor = 0x000000;
		renderer.autoClear = true;
	} else {
		Detector.addGetWebGLMessage();
		return true;
	}
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('container').appendChild(renderer.domElement);
	
	scene = new THREE.Scene();

	// put a camera in the scene
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 0, 1500);
	camera.lookAt(scene.position);
	scene.add(camera);
	
	THREEx.WindowResize.bind(renderer, camera);
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );

	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
		if (total === 0) loadingOn = false;
	};
	loadingManager.onLoad = function() {
		console.log('resources loaded in ' + gameTime);
		loadingOn = false;
	}
	// Setup timeline. Length is additive to previous effect endTime
	tlMain = new TimelineLite({
		paused: true,
		useFrames: false,
		});
	
	loadingOn = true;
	musicOn = false;
	creatingScene = true;
	LoadingAnim = createLoadingAnim({onCompleted:startShow});
	console.log('Loading animation started');
	animate();
	createScene();
}

function musicReady() {
	console.log('Music ready at ' + gameTime)
	loadingManager.itemEnd(musicUrl);
}

function createScene() {
	loadingManager.itemStart('createScene');

	soundManager.setup({
		url: '',
		onready: function() {
			musicReady();
		}
	});
	loadingManager.itemStart(musicUrl);
	musicControl = soundManager.createSound({
		url: musicUrl,
		volume: soundVolume,
	});

	// Push effects to display list
	effects.push(createTriangle('blueknot', 0xffaffa));
	effects.push(createTriangle('redknot', 0x00fafa));
	// ---

	var enabledEffects = effects.filter(function(el,ind,arr) {
			return el.enabled === true; }
		);
	effects = enabledEffects;

	var tlMainTotalDuration = null;
	for (var i = 0; i < effects.length; ++i) {
		if (effects[i].timeline != null) {
			tlScenes.push(effects[i].timeline);
			tlMainTotalDuration += tlScenes[0].totalDuration();
			console.log('timeline added to main:' + i);
		 } else console.log('timeline null for effect: ' + i);
	}

// Setup control timeline
	if (tlMainTotalDuration) {
		tlMain.set(scene, {visible:true}, "0");
		tlMain.call(function(){tlScenes[0].play()}, null, null, "0");
		tlMain.call(function(){tlScenes[1].play()}, null, null, "2");
	}

	creatingScene = false;
	loadingManager.itemEnd('createScene');
}
function startShow() {
	tlMain.play(0);
}

function animate(timestamp) {
	requestAnimationFrame(animate); // Tries to animate at least 60fps
	renderer.render(scene, camera);
}