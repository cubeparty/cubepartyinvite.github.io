'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function knot(label, argColor) {
	var geometry = new THREE.TorusKnotGeometry(100, 100, 100, 60, Math.PI * 4);
	var materialTorus = new THREE.MeshPhongMaterial( { color: argColor, specular: 0xfa0000, emissive: 0x0a0a00, shininess: 10 } );
	var torusKnot = new THREE.Mesh(geometry, materialTorus);
	var directionalLight = new THREE.DirectionalLight(0xffaffa);
	// Actor object
	var obj = {};
	obj.label = label,
	obj.rootObject = new THREE.Object3D();
	obj.rootObject.add(torusKnot);
	obj.enabled = true; // Development time disabling/enabling
	obj.timeline = new TimelineLite({
			paused:true,
			callbackScope: obj,
			onUpdate: function() { obj.updateCb(); },
			get onComplete() { return obj.hideCb; },
			get onStart() { return obj.showCb; },
		});
	directionalLight.position.set(20, 20, 20).normalize();
	torusKnot.position.x += 100 + argColor % 100;
	obj.rootObject.add(directionalLight);
	obj.rootObject.visible = false;	
	obj.showCb = function(p) {
		obj.rootObject.visible = true;
		obj.timeline.play();
	}
	obj.hideCb = function() {
		if (obj.rootObject === null) {
			return;
		} else {
			obj.rootObject.visible = false;
			obj.rootObject = null;
		}
	}
	obj.updateCb = function() {
		 torusKnot.position.x = Math.sin(obj.timeline.time()) * 200 ;
		 torusKnot.position.y = Math.cos(obj.timeline.time()) * 4 ;
		// torusKnot.rotation.x += 0.1;
	}
	obj.timeline.to(torusKnot.rotation, 15.0, {x: 3.14*10, y: 3.14*5}, 0);
	obj.timeline.to(torusKnot.position, 10.0, {x: 314*4, y: 3.14*10,}, 5);
	obj.timeline.to(torusKnot.position, 5.0, {z: 314*2}, 10);
	obj.timeline.set(obj.rootObject, {visible:false});
	// debugger; // Starts debugger in Chrome/Fox
	return new Promise(function(resolve, reject) {
		resolve(obj);
	});
}
