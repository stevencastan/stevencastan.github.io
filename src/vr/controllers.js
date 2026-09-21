import * as THREE from 'three';

export function createVRControllers(scene, renderer) {
  const controllers = [];

  const controllerGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.08, 8);
  const controllerMaterial = new THREE.MeshStandardMaterial({
    color: 0x4dd0ff,
    emissive: 0x1a9fff,
    emissiveIntensity: 0.7,
  });

  const leftController = new THREE.Group();
  leftController.name = 'left-controller';
  leftController.userData = { handedness: 'left' };
  const leftMesh = new THREE.Mesh(controllerGeometry, controllerMaterial);
  leftMesh.rotation.x = Math.PI / 2;
  leftController.add(leftMesh);
  scene.add(leftController);
  controllers.push(leftController);

  const rightController = new THREE.Group();
  rightController.name = 'right-controller';
  rightController.userData = { handedness: 'right' };
  const rightMesh = new THREE.Mesh(controllerGeometry, controllerMaterial.clone());
  rightMesh.rotation.x = Math.PI / 2;
  rightController.add(rightMesh);
  scene.add(rightController);
  controllers.push(rightController);

  const controllerState = {
    left: {
      raycaster: new THREE.Raycaster(),
      direction: new THREE.Vector3(0, 0, -1),
      origin: new THREE.Vector3(),
    },
    right: {
      raycaster: new THREE.Raycaster(),
      direction: new THREE.Vector3(0, 0, -1),
      origin: new THREE.Vector3(),
    },
  };

  function updateControllersFromXR() {
    if (!renderer.xr || !renderer.xr.getController) {
      return;
    }

    const leftXR = renderer.xr.getController(0);
    const rightXR = renderer.xr.getController(1);

    leftController.position.copy(leftXR.position);
    leftController.quaternion.copy(leftXR.quaternion);
    rightController.position.copy(rightXR.position);
    rightController.quaternion.copy(rightXR.quaternion);
  }

  function getInteractions(interactiveObjects) {
    const hits = [];
    const controllersArray = [leftController, rightController];

    controllersArray.forEach((controller, index) => {
      const localState = controllerState[index === 0 ? 'left' : 'right'];
      localState.origin.setFromMatrixPosition(controller.matrixWorld);
      localState.direction.set(0, 0, -1).applyQuaternion(controller.quaternion).normalize();
      localState.raycaster.set(localState.origin, localState.direction);

      const results = localState.raycaster.intersectObjects(interactiveObjects, true);
      if (results.length) {
        hits.push({ controller, result: results[0], handedness: controller.userData.handedness });
      }
    });

    return hits;
  }

  function syncToRenderer() {
    updateControllersFromXR();
  }

  return {
    controllers,
    leftController,
    rightController,
    getInteractions,
    syncToRenderer,
    controllerState,
  };
}
