import * as THREE from 'three';

export function createDesktopControls(player, camera, { container } = {}) {
  const activeKeys = new Set();
  const target = container || document.body;
  const sensitivity = 0.0023;

  function update(delta) {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() === 0) {
      forward.set(0, 0, -1);
    }
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    const movement = new THREE.Vector3();

    const moveForward = activeKeys.has('KeyW') || activeKeys.has('ArrowUp');
    const moveBackward = activeKeys.has('KeyS') || activeKeys.has('ArrowDown');
    const moveLeft = activeKeys.has('KeyA') || activeKeys.has('ArrowLeft');
    const moveRight = activeKeys.has('KeyD') || activeKeys.has('ArrowRight');

    if (moveForward) movement.add(forward);
    if (moveBackward) movement.sub(forward);
    if (moveLeft) movement.sub(right);
    if (moveRight) movement.add(right);

    if (movement.lengthSq() > 0) {
      movement.normalize().multiplyScalar(player.speed * delta);
      player.position.add(movement);
      player.position.y = player.height;
      camera.position.copy(player.position);
    }
  }

  function handleKeyDown(event) {
    activeKeys.add(event.code);
    if (event.code === 'KeyP') {
      if (document.pointerLockElement === target) {
        document.exitPointerLock();
      } else {
        target.requestPointerLock();
      }
    }
  }

  function handleKeyUp(event) {
    activeKeys.delete(event.code);
  }

  function handleMouseMove(event) {
    if (document.pointerLockElement !== target) {
      return;
    }

    player.yaw -= event.movementX * sensitivity;
    player.pitch -= event.movementY * sensitivity;
    player.pitch = THREE.MathUtils.clamp(player.pitch, -1.35, 1.35);

    camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
  }

  function bind() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);

    target.addEventListener('click', () => {
      if (document.pointerLockElement !== target) {
        target.requestPointerLock();
      }
    });
  }

  bind();

  return {
    update,
    activeKeys,
    destroy() {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
    },
    isPointerLocked() {
      return document.pointerLockElement === target;
    },
  };
}
