import * as THREE from 'three';

export function createLighting(scene) {
  const hemisphere = new THREE.HemisphereLight(0xbfe3ff, 0x191b21, 1.15);
  hemisphere.position.set(0, 6, 0);

  const directional = new THREE.DirectionalLight(0xffffff, 1.2);
  directional.position.set(4, 10, 2);
  directional.castShadow = true;
  directional.shadow.mapSize.set(1024, 1024);
  directional.shadow.camera.left = -12;
  directional.shadow.camera.right = 12;
  directional.shadow.camera.top = 12;
  directional.shadow.camera.bottom = -12;
  directional.shadow.camera.near = 0.5;
  directional.shadow.camera.far = 30;

  const fill = new THREE.PointLight(0x6ec8ff, 1.2, 18, 2);
  fill.position.set(-3, 2.5, -2.5);

  scene.add(hemisphere, directional, fill);

  return { hemisphere, directional, fill };
}
