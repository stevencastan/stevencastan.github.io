import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09121c);
  scene.fog = new THREE.Fog(0x09121c, 7, 26);
  return scene;
}
