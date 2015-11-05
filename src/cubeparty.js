'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
var _context = {
	_actions: [],
	loadingManager: function() {
		//debugger;
		var lm = new THREE.LoadingManager(
			function() { // onLoad
				console.log('All resources loaded, ready to rock \\m/');
				_context.loadingOn = false; 
				_context.notifyLoadingReady.forEach(function(f) { f(); });
			},
			function (item, loaded, total) { // onProgress
				console.log('Completed ' + item, loaded + '/' + total);
			},
			function () { // onError
				console.error('Failed to load resources');
			}
		);
		lm.itemStart('Initialization');
		return lm;
	}(),
	controlTimeline: new TimelineLite({
		paused: true,
		useFrames: false,
		immetiateRender: false,
	}),
	action: function(fun, label, params) {
		_context.loadingManager.itemStart(label);
		fun.apply(null, [label].concat(params)).then(function(obj) {
			_context._actions[label] = obj;
			_context.loadingManager.itemEnd(label);
			if ((/^Anssi/).test(label)) { // Shibboleth
				console.log('Context attached to object');
				obj.ctx = _context;
			}
		});
	},
	loadingOn: true,
	notifyLoadingReady:[],
	soundVolume: 0,
};
function createCubeParty(setupTimeline) {
	if (Detector.webgl) {
		var renderer = new THREE.WebGLRenderer({antialias:false,});
		renderer.autoClearColor = 0x000000;
		renderer.autoClear = true;
	} else {
		Detector.addGetWebGLMessage();
		console.error('failed to load webgl');
		return false;
	}
	var stats;
	//stats = new Stats(); // Comment on release
	var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('container').appendChild(renderer.domElement);
	var rootScene = new THREE.Scene();
	// Initialize loading animation
	init(rootScene, stats, renderer, camera);
	// put a camera in the scene
	camera.position.set(0, 0, 1500);
	camera.lookAt(rootScene.position);
	THREEx.WindowResize.bind(renderer, camera);
	rootScene.add(camera);
	var setupTimelineParams1 = [_context.action, { // audio
		set url(u) { _context.audioUrl = u; },
		set volume(v) { _context.soundVolume = v; },
		}];
	var setupTimelineParams2 = {"scene":rootScene, "ctl":_context.controlTimeline, /*"actors":_context._actions,*/
		"controls": {
			"startShow":function() { _context.loadingOn = false; },
			"stopShow":stopShow
		},
		"audio":{
		set setSoundVolume(v) { _context.soundVolume = v; },
		get soundVolume() { return _context.soundVolume; }
		}};
	setupTimeline.apply(null, setupTimelineParams1);

return new Promise(function(resolve, reject) {
	_context.notifyLoadingReady.push(function() {
		// Shorthands for actors in context
		Object.keys(_context._actions).forEach(function(k) {
			setupTimelineParams2[k] = _context._actions[k];
		});
		resolve(setupTimelineParams2); });
});
}
function init(rootScene, stats, renderer, camera) {
	if (stats) {
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.body.appendChild( stats.domElement );
	}
	var LoadingAnim = createLoadingAnim({
		onCompleted:function() {
			startShow();
		},
		scene: rootScene, // Using same scene for all
		get loading() { return _context.loadingOn; }
	});
	LoadingAnim.then(function(playfun) {
		console.log('Loading animation ready to play..');
		playfun();
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
	if (!soundManager.canPlayURL(_context.audioUrl)) {
		console.error('Music format error on ' + _context.audioUrl);
	}
	_context.musicControl = soundManager.createSound({
		url: _context.audioUrl,
		volume: _context.soundVolume,
		autoLoad: true,
		autoPlay: false,
		onload: function() {
			musicReady();
		},
		
	});
}
function musicReady() {
	_context.loadingManager.itemEnd('Initialization');
}
function startShow() {
	_context.musicControl.play();
	_context.controlTimeline.play(0);
	console.log('Rock on!');
}
function stopShow() {
	_context.musicControl.stop();
	_context.controlTimeline.stop();
	console.log('Thank you for watching...');
}
function animate(renderer, scene, camera, stats) {
	requestAnimationFrame(function animateCb() {
		animate(renderer, scene, camera, stats);
		}); // Tries to animate@60 fps
	renderer.render(scene, camera);
	stats && stats.update(); // Comment this on release
}
