'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function createTriangle(label, argColor) {
	var startLabel = label + 'Start';
	var completedLabel = label + 'Completed';
	createTriangle.enabled = true;
	createTriangle.effectLengthSecs = 4.0; // Secs. Timeline takes care of timing/scaling. Can run also in frame mode.
	createTriangle.effectLength = 160; // gameTime, frames, should run near 60 fps as default
	
	var obj = {};
	obj.enabled = createTriangle.enabled;
	obj.effectLength = createTriangle.effectLength,
	obj.rootObject = new THREE.Object3D();
	obj.timeline = new TimelineLite({
			paused:true,
			callbackScope: obj,
//			get updateCallback() { return obj.updateCb; },
			get onComplete() { return obj.hideCb; },
			get onStart() { return obj.showCb; },
			});

	var geometry = new THREE.TorusKnotGeometry(100, 100, 100, 60, Math.PI * 4);
	var materialTorus = new THREE.MeshPhongMaterial( { color: argColor, specular: 0xfa0000, emissive: 0x0a0a00, shininess: 10 } );
	var torusKnot = new THREE.Mesh(geometry, materialTorus);	
	obj.rootObject.add(torusKnot);

	var directionalLight = new THREE.DirectionalLight(0xffaffa);
	directionalLight.position.set(20, 20, 20).normalize();
	
	torusKnot.position.x += 100 + argColor % 100;
	obj.rootObject.add(directionalLight);

	obj.rootObject.visible = false;
	scene.add(obj.rootObject);
	obj.showCb = function() {
		obj.rootObject.visible = true;
		obj.timeline.play();
		console.log('EFFSHOW');
	}

	obj.hideCb = function() {
		if (obj.rootObject === null) {
			return;
		} else {
		obj.rootObject.visible = false;
		scene.remove(obj.rootObject);
		obj.rootObject = null;
		}
//		console.log('hiding' + label + ' at gt:' + gameTime);
	}

	obj.updateCb = function() {
		// torusKnot.rotation.y += 0.1;
		// torusKnot.rotation.x += 0.1;
		console.log('update');
	}

	obj.timeline.addLabel(startLabel);
// labels do not propagate to parent, tlMain.call cant be called with labels
//	obj.timeline.set(obj.rootObject, {visible:true, immediateRender:false});
	obj.timeline.to(torusKnot.rotation, 2.0, {x: 6.28, y: 6.28});
	obj.timeline.set(obj.rootObject, {visible:false});
	obj.timeline.addLabel(completedLabel);
	//debugger;
	return obj;
}
