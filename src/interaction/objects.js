import * as THREE from 'three';

export function createInteractiveObjects() {
  const group = new THREE.Group();
  const interactiveObjects = [];

  const palette = [
    0x4ecdc4,
    0xff9f1c,
    0xff6b6b,
    0x8ac6ff,
    0xb8ffb8,
    0xf6d365,
  ];

  for (let i = 0; i < 6; i += 1) {
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const material = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      emissive: palette[i % palette.length],
      emissiveIntensity: 0.15,
      roughness: 0.5,
      metalness: 0.2,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-2.8 + i * 1.15, 0.95, -2.2 + (i % 3) * 1.1);
    mesh.userData = {
      name: `Objeto ${i + 1}`,
      description: `Muestra información del objeto ${i + 1}.`,
      type: 'interactive',
    };
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    group.add(mesh);
    interactiveObjects.push(mesh);
  }

  const cpu = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.3, 24),
    new THREE.MeshStandardMaterial({
      color: 0x9ad0ff,
      emissive: 0x1c4f96,
      emissiveIntensity: 0.4,
      roughness: 0.35,
      metalness: 0.8,
    })
  );
  cpu.position.set(2.7, 1.2, 1.7);
  cpu.userData = {
    name: 'Núcleo',
    description: 'Modelo de prueba para una pieza central del entorno.',
    type: 'interactive',
  };
  cpu.castShadow = true;
  group.add(cpu);
  interactiveObjects.push(cpu);

  const infoMarker = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.75,
    })
  );
  infoMarker.position.set(-1.3, 1.35, 2.9);
  infoMarker.userData = {
    name: 'Indicador',
    description: 'Punto de interés para comprobar el panel informativo.',
    type: 'interactive',
  };
  infoMarker.castShadow = true;
  group.add(infoMarker);
  interactiveObjects.push(infoMarker);

  return { group, interactiveObjects };
}
