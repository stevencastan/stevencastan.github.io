import * as THREE from 'three';

export function createRaycaster(camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(0, 0);

  function setPointerFromEvent(event, container) {
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function intersect(scene, objects, event, container) {
    if (event) {
      setPointerFromEvent(event, container);
    }

    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(objects, true);
  }

  return {
    raycaster,
    pointer,
    intersect,
    setPointerFromEvent,
    updateCamera(newCamera) {
      camera = newCamera;
    },
    updateRenderer(newRenderer) {
      renderer = newRenderer;
    },
  };
}
