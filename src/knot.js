'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function createKnot(label, argColor) {
	// Setup objects for the return.
	loadingManager.itemStart(label);
	createKnot.enabled = true;
	var geometry = new THREE.TorusKnotGeometry(100, 100, 100, 60, Math.PI * 4);
	var materialTorus = new THREE.MeshPhongMaterial( { color: argColor, specular: 0xfa0000, emissive: 0x0a0a00, shininess: 10 } );
	var torusKnot = new THREE.Mesh(geometry, materialTorus);
	var directionalLight = new THREE.DirectionalLight(0xffaffa);
	// Object that will be returned.
	var obj = {};
	obj.rootObject = new THREE.Object3D();
	obj.rootObject.add(torusKnot);
	obj.enabled = createKnot.enabled;
	obj.timeline = new TimelineLite({
			paused:true,
			callbackScope: obj,
//			updateCallback: function() { obj.updateCb(); },
			get onComplete() { return obj.hideCb; },
			get onStart() { return obj.showCb; },
		});
	directionalLight.position.set(20, 20, 20).normalize();
	torusKnot.position.x += 100 + argColor % 100;
	obj.rootObject.add(directionalLight);
	obj.rootObject.visible = false;
	scene.add(obj.rootObject);
	obj.showCb = function() {
		obj.rootObject.visible = true;
		obj.timeline.play();
	}
	obj.hideCb = function() {
		if (obj.rootObject === null) {
			return;
		} else {
			obj.rootObject.visible = false;
			scene.remove(obj.rootObject);
			obj.rootObject = null;
		}
	}
	obj.updateCb = function() {
		// torusKnot.rotation.y += 0.1;
		// torusKnot.rotation.x += 0.1;
	}
	obj.timeline.to(torusKnot.rotation, 2.0, {x: 6.28, y: 6.28});
	obj.timeline.set(obj.rootObject, {visible:false});
	loadingManager.itemEnd(label);
	// debugger; // Starts debugger in Chrome
	return obj;
}
