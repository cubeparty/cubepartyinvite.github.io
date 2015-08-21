// Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function createTriangle(argColor) {
'use strict'
	var obj = {};
	obj.rootObject = new THREE.Object3D();
	obj.enabled = true;
	obj.effectLength = 120; // gameTime
	obj.timeline = new TimelineLite({paused:true, callbackScope:obj, updateCallback:obj.updateCb});

	var geometry = new THREE.TorusKnotGeometry(100, 100, 100, 60, Math.PI * 4);
	var materialTorus = new THREE.MeshPhongMaterial( { color: argColor, specular: 0xfa0000, emissive: 0x0a0a00, shininess: 10 } );
	var torusKnot = new THREE.Mesh(geometry, materialTorus);	
	obj.rootObject.add(torusKnot);

	var directionalLight = new THREE.DirectionalLight(0xffaffa);
	directionalLight.position.set(20, 20, 20).normalize();
	
	torusKnot.position.x += 100;
	obj.rootObject.add(directionalLight);

	obj.rootObject.visible = false;
	scene.add(obj.rootObject);
	obj.show = function() {
		obj.timeline.play(0);
	}
	
	obj.hide = function() {
		obj.rootObject.visible = false;
		scene.remove(obj.rootObject);
		obj.rootObject = null;
	}
	obj.updateCb = function() {
		torusKnot.rotation.y += 0.1;
		torusKnot.rotation.x += 0.1;
		console.log('update');
	}
	obj.update = function() {
		// update without timeline/tween
	}
	obj.timeline.set(obj.rootObject, {visible:true});
	obj.timeline.to(torusKnot.rotation, 5, {x: 6.28, y: 6.28});
	obj.timeline.set(obj.rootObject, {visible:false});
	return obj;
}
