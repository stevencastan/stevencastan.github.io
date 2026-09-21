import * as THREE from 'three';

export function createPlayer(camera) {
  const player = {
    position: camera.position.clone(),
    velocity: new THREE.Vector3(),
    camera,
    speed: 4.2,
    yaw: 0,
    pitch: 0,
    height: 1.7,
    vrRig: new THREE.Group(),
  };

  camera.position.set(0, player.height, 5);
  camera.rotation.order = 'YXZ';
  player.position.copy(camera.position);
  player.vrRig.position.copy(player.position);

  return player;
}

export function syncPlayerCamera(player) {
  player.camera.position.copy(player.position);
  player.camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
}
