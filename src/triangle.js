// Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function createTriangle() {
'use strict'
	var obj = {};
	obj.enabled = true;
	obj.effectLength = 5000; // ms

	var geometry = new THREE.TorusKnotGeometry(100, 100, 100, 60, Math.PI * 4);
	var materialTorus = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xfa0000, emissive: 0x0a0a00, shininess: 10 } );
	var torusKnot = new THREE.Mesh(geometry, materialTorus);

	var directionalLight = new THREE.DirectionalLight(0xffaffa);
	directionalLight.position.set(20, 20, 20).normalize();
	
	torusKnot.position.x += 100;

	obj.show = function() {
		scene.add(directionalLight);
		scene.add(torusKnot);
	}
	
	obj.hide = function() {
		scene.remove(torusKnot);
		scene.remove(directionalLight);
	}
	
	obj.update = function(currentTime) {
		torusKnot.rotation.y += 0.1;
		torusKnot.rotation.x += 0.1;
	}
	return obj;
}