// Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
function createLoadingAnim() {
'use strict'
	var obj = {};
	obj.enabled = true;
	var tickInterval = 10;
	var tickCount = 0, numOfTicks = 20;
	var startDelay = 30;
	var innerMaterial = new THREE.MeshBasicMaterial();
	var innerCylinder = new THREE.Mesh(new THREE.CylinderGeometry(80, 80, 10, 32), innerMaterial);
	var glowCylinder = new THREEx.GeometricGlowMesh(innerCylinder);
	glowCylinder.object3d.scale.x = 4.0;
	glowCylinder.outsideMesh.scale.x = 0.999;
	glowCylinder.outsideMesh.scale.y = 0.8;
	var inGlowUniforms  = glowCylinder.insideMesh.material.uniforms;
	inGlowUniforms.glowColor.value.set('yellow');
	var outGlowUniforms = glowCylinder.outsideMesh.material.uniforms;
	 
	outGlowUniforms.glowColor.value.set(0x603000);

	var reset = true;
	obj.show = function() {
		scene.add(glowCylinder.object3d);
	}
	
	obj.hide = function() {
		scene.remove(glowCylinder.object3d);
	}
	
	obj.update = function(currentTime) {
	if (currentTime < startDelay) return; // Start animation after start delay
	else if ((currentTime + 1) % tickInterval == 0) {
			if (reset) {
				glowCylinder.outsideMesh.scale.x = 0;
				glowCylinder.outsideMesh.scale.y = 0.3;
				outGlowUniforms.glowColor.value.set(0x600000);
				reset = false;
			}

			if (++tickCount == numOfTicks) {
				tickCount = 0;
				reset = true;
			} else {
				glowCylinder.outsideMesh.scale.x = tickCount/numOfTicks;
			}
		}
	}
	return obj;
}