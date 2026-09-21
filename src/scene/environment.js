import * as THREE from 'three';

export function createEnvironment(scene) {
  const room = new THREE.Group();

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x192939,
    roughness: 0.92,
    metalness: 0.1,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x233850,
    roughness: 0.85,
    metalness: 0.15,
  });

  const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMaterial);
  wallBack.position.set(0, 3, -10);
  room.add(wallBack);

  const wallFront = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMaterial);
  wallFront.position.set(0, 3, 10);
  room.add(wallFront);

  const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMaterial);
  wallLeft.rotation.y = Math.PI / 2;
  wallLeft.position.set(-10, 3, 0);
  room.add(wallLeft);

  const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMaterial);
  wallRight.rotation.y = -Math.PI / 2;
  wallRight.position.set(10, 3, 0);
  room.add(wallRight);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.8, 0.6, 32),
    new THREE.MeshStandardMaterial({ color: 0x314d6b, roughness: 0.7, metalness: 0.25 })
  );
  platform.position.set(0, 0.3, 0);
  platform.castShadow = true;
  platform.receiveShadow = true;
  room.add(platform);

  const accent = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.08, 16, 120),
    new THREE.MeshStandardMaterial({ color: 0x6ec8ff, emissive: 0x1c7db4, roughness: 0.4 })
  );
  accent.rotation.x = Math.PI / 2;
  accent.position.set(0, 0.6, 0);
  room.add(accent);

  scene.add(room);

  return { room, floor, walls: [wallBack, wallFront, wallLeft, wallRight], platform, accent };
}
