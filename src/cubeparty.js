// Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
var loadingOn = true;
var musicOn = false;
var creatingScene = true;
var LoadingAnim;
var musicControl;
var maxJitter = 1200; // ms

function init() {
	'use strict'
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer({
			antialias		: true,	// to get smoother output
		});
		renderer.autoClearColor = 0x000000;
		renderer.autoClear = true;
	} else {
		Detector.addGetWebGLMessage();
		return true;
	}
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('container').appendChild(renderer.domElement);
	
	scene = new THREE.Scene();
//	scene.fog = new THREE.FogExp2(0x000000, 0);

	// put a camera in the scene
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 0, 1500);
	camera.lookAt(scene.position);
	scene.add(camera);
	
	// transparently support window resize
	THREEx.WindowResize.bind(renderer, camera);
	setTimeout("LoadingAnim.show();animate();console.log('Loading aninm show');", 500);
	setTimeout("createScene();", 1000);
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );
	LoadingAnim = createLoadingAnim();

	loadingOn = true;
	musicOn = false;
	creatingScene = true;
	
	effects.push(LoadingAnim);
	timeLine.push(0); // Demo start time
	timeLine.push(maxJitter); // Demo jitter tolerance
}

function musicReady() {
	'use strict'
	loadingOn = false;
}

function pushTime(mseconds) {
	previous = 0;
	previous = timeLine[timeLine.length - 1];
/*	if (timeLine.length > 1) {
		previous = timeLine[timeLine.length - 1];
	} else {
		timeLine.push(0);
	}*/
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
	musicControl = soundManager.createSound({
		url: 'res/jam.mp3'
	});

	effects.push(createTriangle());
	
	var enabledEffects = effects.filter(function(el,ind,arr) {
			return el.enabled === true; } 
		);
	effects = enabledEffects;
	for (var i = 1; i < effects.length; ++i) {
		pushTime(effects[i].effectLength);
	}
	console.log(timeLine);
	creatingScene = false;
}

function animate(timestamp) {
'use strict'
	requestAnimationFrame(animate);

	if (timeLine.length > 1) {
		var startTime = timeLine[0];
		var endTime = timeLine[1];
		if (endTime > gameTime) { // Jitter buffer and minimum load time is bigger than gametime.. mandatory loading anim running time
			effects[0].update(gameTime - startTime);
		} else {
			if (loadingOn || creatingScene) {  // loading still going bit max time crossed
				effects[0].update(gameTime - startTime);
				endTime = gameTime; // Sets the jitter for next effect start time
			} else {
				startTime = endTime;
				effects[0].hide();
				timeLine.shift(); // Shift starting time to next effect
				effects.shift();
				if (timeLine.length > 1) {
					effects[0].show();
					effects[0].update(gameTime - startTime);
					if (!musicOn && !loadingOn && !creatingScene) {
						// Demo starts
						musicControl.play();
						musicOn = true;
					}
				} else {
					console.log("exit"); console.log(musicControl.position-gameTime);
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
	if (musicOn) {
		var realTime = Math.ceil(maxJitter + musicControl.position); // Skip ticks if music aheads more than maxJitter
		if (gameTime < realTime) {
			gameTime = realTime;
		}
	}
}

function render() {
'use strict'
	renderer.render( scene, camera );
}
