export function createVRControls(player, renderer) {
  return {
    update(delta) {
      if (!renderer.xr?.isPresenting || !player.camera) {
        return;
      }

      player.position.copy(player.camera.position);
      player.position.y = 1.7;

      if (typeof player.applyVRMotion === 'function') {
        player.applyVRMotion(delta);
      }
    },
    prepareForLocomotion() {
      // Preparado para locomoción futura con joystick o teletransporte.
    },
  };
}
