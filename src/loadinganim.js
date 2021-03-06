'use strict'; // Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function createLoadingAnim(params, loading) {
	return new Promise(function(resolve, reject) {
		var obj = {};
		var innerMaterial = new THREE.MeshBasicMaterial();
		var innerCylinder = new THREE.Mesh(new THREE.CylinderGeometry(80, 80, 10, 32), innerMaterial);
		var glowCylinder = new THREEx.GeometricGlowMesh(innerCylinder);
		var inGlowUniforms  = glowCylinder.insideMesh.material.uniforms;
		var outGlowUniforms = glowCylinder.outsideMesh.material.uniforms;
		glowCylinder.object3d.scale.x = 4.0;
		glowCylinder.outsideMesh.scale.x = 0.999;
		glowCylinder.outsideMesh.scale.y = 0.8;
		inGlowUniforms.glowColor.value.set('yellow');
		outGlowUniforms.glowColor.value.set(0x603000);
		obj.showCb = function() {
			console.log('Show loading animation');
			params.scene.add(glowCylinder.object3d);
			obj.showCb = undefined; // Show only once onStart
		}
		obj.restartCb = function() {
			if (params.loading === true) {
				obj.timeline.seek('startcycle');
			} else {
				obj.hideCb();
				params.onCompleted();
			}
		}
		obj.hideCb = function() {
			params.scene.remove(glowCylinder.object3d);
			glowCylinder.object3d = null;
			obj.timeline = null;
		}
		obj.updateCb = function(currentTime) {
		}
		obj.timeline = new TimelineLite ({
			paused:true,
			callbackScope: obj,
			get onComplete() { return obj.restartCb; },
			get onStart() { return obj.showCb; },
		});
		obj.timeline.add(TweenLite.set(glowCylinder.outsideMesh.scale, {x:0.001,y:0.3,},'startcycle'));
		obj.timeline.add(TweenLite.to(glowCylinder.outsideMesh.scale, 2.0, {x:1,}));
		obj.timeline.add(TweenLite.to(glowCylinder.outsideMesh.scale, 2.0, {x:0.001,}));
		resolve(function() {
			obj.timeline.play();
		});
	});
}
