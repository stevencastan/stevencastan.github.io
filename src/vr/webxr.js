import { VRButton } from 'three/addons/webxr/VRButton.js';

export function createXRSetup(renderer, { sessionInit = {} } = {}) {
  const xrButton = VRButton.createButton(renderer, {
    optionalFeatures: ['local-floor', 'hand-tracking', 'hit-test'],
    ...sessionInit,
  });

  const xrSetup = {
    button: xrButton,
    isSupported: !!navigator.xr,
    setButtonLabel(label) {
      if (xrButton && xrButton.textContent) {
        xrButton.textContent = label;
      }
    },
    enable() {
      if (!renderer.xr) {
        return false;
      }

      renderer.xr.enabled = true;
      return true;
    },
    disable() {
      if (!renderer.xr) {
        return false;
      }

      renderer.xr.enabled = false;
      return true;
    },
    async requestSession() {
      if (!navigator.xr) {
        throw new Error('WebXR no está disponible en este navegador.');
      }

      return navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking'],
      });
    },
  };

  return xrSetup;
}
