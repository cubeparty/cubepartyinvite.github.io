'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function still(label, file) {
	var unif = {
		amplitude: {
			type: 'f',
			value: 1.0
		},
		color: {
			type: 'f',
			value: 0.0
		}
	};
	var attrib = {
		displacement: {
			type: 'f', // a float
			value: [] // an empty array
		}
	};
	var material = new THREE.ShaderMaterial( {
		uniforms: unif,
//		attributes: attrib,
		vertexShader: document.getElementById('vertexShader').innerHTML,
		fragmentShader: document.getElementById('fragmentShader').innerHTML,
		needsUpdate: true,
		side: THREE.DoubleSide
	});
	


//buffgeom.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
	var geometry = new THREE.PlaneGeometry(500, 500, 10);
	geometry = new THREE.BufferGeometry().fromGeometry(geometry, null);
	var mesh = new THREE.Mesh(geometry, material);
	console.log(mesh.geometry);
	var verts = mesh.geometry.attributes.position.array;
	console.log(verts);
	var values = attrib.displacement.value;
	var arr = new Float32Array(verts.length/3);
	for (var v = 0; v < verts.length/3; v++) {
		arr[v] = Math.floor(Math.random() * 30);
	}
	console.log(arr);
	geometry.addAttribute('displacement', new THREE.BufferAttribute(arr, 1));
	// Actor object
	var obj = {};
	obj.label = label,
	obj.rootObject = new THREE.Object3D();
	obj.rootObject.add(mesh);
	obj.timeline = new TimelineLite({
			paused:true,
			callbackScope: obj,
			onUpdate: function() { obj.updateCb(); },
			get onComplete() { return obj.hideCb; },
			get onStart() { return obj.showCb; },
		});
//	directionalLight.position.set(20, 20, 20).normalize();
//	mesh.position.x += 100 + argColor % 100;
//	obj.rootObject.add(directionalLight);
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
		 unif.color.value = Math.abs(Math.sin(obj.timeline.time()*.5));
		 unif.amplitude.value = Math.sin(obj.timeline.time()) * 10;
		// console.log(unif.color.value);
		// mesh.rotation.x += 0.1;
	}
	mesh.position.x = Math.sin(obj.timeline.time()) * 3.0;
	mesh.position.y = Math.cos(obj.timeline.time()*0.5);
	mesh.position.z = Math.acos(obj.timeline.time()*20);
	
	obj.timeline.to(mesh.rotation, 40.0, {x: 6.28*5, y: 6.28*3}, 0.0);
	obj.timeline.set(obj.rootObject, {visible:false});
	// debugger; // Starts debugger in Chrome/Fox
	return new Promise(function(resolve, reject) {
		resolve(obj);
	});
}
