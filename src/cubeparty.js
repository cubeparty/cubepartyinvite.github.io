// Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
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

function init() {
	'use strict'
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
	setTimeout("LoadingAnim.show();animate();console.log('Loading started');", 500);
	setTimeout("createScene();", 1000);
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
	
	LoadingAnim = createLoadingAnim();

	loadingOn = true;
	musicOn = false;
	creatingScene = true;
	effects.push(LoadingAnim);
	console.log('Loading animation initialized');
	timeLine.push(0); // Demo start time
	timeLine.push(effects[0].effectLength); // Minimum loading time
}

function musicReady() {
	'use strict'
	console.log('Music ready at ' + gameTime)
	loadingManager.itemEnd(musicUrl);
}

function pushTime(mseconds) {
	previous = 0;
	previous = timeLine[timeLine.length - 1];
	timeLine.push(previous + mseconds);
}

function createScene() {
'use strict'
	soundManager.setup({
		url: '',
		onready: function() {
			musicReady();
		}
	});
	loadingManager.itemStart(musicUrl);
	musicControl = soundManager.createSound({
		url: musicUrl
	});

	// Push effects to display list
	effects.push(createTriangle(0xffaffa));
	effects.push(createTriangle(0x00fafa));
	// ---
	
	var enabledEffects = effects.filter(function(el,ind,arr) {
			return el.enabled === true; }
		);
	effects = enabledEffects;
	
	// Setup timeline. Length is additive to previous effect endTime
	for (var i = 1; i < effects.length; ++i) {
		pushTime(effects[i].effectLength);
	}
	creatingScene = false;
}

function animate(timestamp) {
'use strict'
	requestAnimationFrame(animate); // Tries to animate at least 60fps

	if (timeLine.length > 1) {
		var startTime = timeLine[0];
		var endTime = timeLine[1]; // we chop effect from end without offset
		if (endTime > gameTime) { // Default effect running loop
			effects[0].update(gameTime - startTime);
		} else { // endTime passed, time to shift effect
			startOffset = gameTime - endTime; // Recalculate start offset
			if (loadingOn || creatingScene) {  // Special case for slow loading of resources
				effects[0].update(gameTime);
			} else { // endTime passed and time to shift effect
				var startTime = endTime + startOffset; // Start effect from zero
				effects[0].hide(); // Hide current effect
				timeLine.shift(); // Shift to next effect
				effects.shift();
				if (timeLine.length > 1) {
					effects[0].show();
					effects[0].update(gameTime - startTime); // Init scene with local gameTime 0
					if (!musicOn && !loadingOn && !creatingScene) {
						// Scene loaded, time to start demo
						musicControl.play();
						startTimeAbsolute = timestamp;
						startTimeGameTime = gameTime;
						musicOn = true;
					}
				} else {
					musicControl.stop(); // Please make it stop
					musicOn = false;
					setTimeout("window.close()", 4000);
				}
			}
		}
	}
	render();
	gameTime++;
	stats.update();
	// Todo frame rate lock to frameRateLimit
}

function render() {
'use strict'
	renderer.render( scene, camera );
}
