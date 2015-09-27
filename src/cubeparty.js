'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
var loadingOn = true;
var disableSound = true;
var soundVolume = disableSound ? 0 : 100;
var _context = {
	_actions: [],
	action: function(actionObject) {
		_context.loadingManager.itemStart(actionObject.label);
		_context._actions.push(actionObject);
		actionObject.ctx = _context;
		_context.loadingManager.itemEnd(actionObject.label);
		return actionObject;
	},
};
function createCubeParty(setupTimeline) {
	_context.loadingManager = new THREE.LoadingManager(
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
	_context.loadingManager.itemStart('init');
	if (Detector.webgl) {
		var renderer = new THREE.WebGLRenderer({antialias:false,});
		renderer.autoClearColor = 0x000000;
		renderer.autoClear = true;
	} else {
		Detector.addGetWebGLMessage();
		console.error('failed to load webgl');
		return false;
	}
	var stats = new Stats();
	var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('container').appendChild(renderer.domElement);
	var rootScene = new THREE.Scene();
	var tlMain = new TimelineLite({
		paused: true,
		useFrames: false,
	});	
	// Initialize loading animation
	init(rootScene, _context.loadingManager, stats, renderer, camera, tlMain);
	// put a camera in the scene
	camera.position.set(0, 0, 1500);
	camera.lookAt(rootScene.position);
	THREEx.WindowResize.bind(renderer, camera);
	rootScene.add(camera);
	setupTimeline(_context, rootScene, tlMain);
	_context.loadingManager.itemEnd('init');
}
function init(rootScene, lm, stats, renderer, camera, tlMain) {
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
	var LoadingAnim = createLoadingAnim({
		onCompleted:function() { startShow(tlMain); },
		scene: rootScene,
		get loading() { return loadingOn; }
	});
	soundManager.setup({
		url: '',
		onready: function() {
			soundManagerReady();
		},
			preferFlash: false,
			debugMode: false,
		});
	animate(renderer, rootScene, camera, stats);
}
function soundManagerReady() {
	_context.loadingManager.itemEnd('SoundManager');
	_context.loadingManager.itemStart(_context.audio);
	if (!soundManager.canPlayURL(_context.audio)) {
		console.error('Music format error on ' + _context.audio);
	}
	_context.musicControl = soundManager.createSound({
		url: _context.audio,
		volume: soundVolume,
		autoLoad: true,
		autoPlay: false,
		onLoad: function() {
			musicReady();
		},
		
	});
}
function musicReady() {
	console.log('Music ready', musicControl);
	_context.loadingManager.itemEnd(musicUrl);
}
function startShow(tl) {
	_context.loadingManager.itemEnd('loadingAnim');
	_context.musicControl.play();
	tl.play(0);
	console.log('Rock on!');
}
function stopShow(tl) {
	_context.musicControl.stop();
	tl.stop();
	console.log('Thank you for watching...');
}
function animate(renderer, scene, camera, stats) {
	requestAnimationFrame(function animateCb() {
		animate(renderer, scene, camera, stats);
		}); // Tries to animate@60 fps
	renderer.render(scene, camera);
	stats.update(); // Comment this on release
}
