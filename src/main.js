import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { createScene } from './scene/scene.js';
import { createLighting } from './scene/lighting.js';
import { createEnvironment } from './scene/environment.js';
import { createPlayer, syncPlayerCamera } from './player/player.js';
import { createDesktopControls } from './player/desktopControls.js';
import { createVRControls } from './player/vrControls.js';
import { createInteractiveObjects } from './interaction/objects.js';
import { createInformationPanel, createWorldInfoBillboard } from './interaction/informationPanel.js';
import { createRaycaster } from './interaction/raycaster.js';
import { createXRSetup } from './vr/webxr.js';
import { createVRControllers } from './vr/controllers.js';

const sceneContainer = document.querySelector('#scene-container');
const loadingMessage = document.querySelector('.loading-message');

if (!sceneContainer || !loadingMessage) {
  throw new Error('No se encontró la estructura base de la experiencia VR.');
}

const hud = document.createElement('div');
hud.className = 'hud';
hud.innerHTML = `
  <div class="status-card">
    <span class="status-label">Estado</span>
    <strong id="status-text">Preparando escena…</strong>
  </div>
  <div class="controls-card">
    <span class="status-label">Controles</span>
    <ul>
      <li>PC: WASD / flechas + ratón</li>
      <li>VR: visor + mandos</li>
      <li>Click / select: objetos interactivos</li>
    </ul>
  </div>
`;
sceneContainer.appendChild(hud);

const statusText = document.querySelector('#status-text');
const infoPanel = createInformationPanel();
const scene = createScene();
const worldInfoBillboard = createWorldInfoBillboard();
scene.add(worldInfoBillboard.mesh);

const worldInfoPanel = document.createElement('div');
worldInfoPanel.className = 'world-info-panel hidden';
worldInfoPanel.innerHTML = '<strong>Objeto</strong><span>Selecciona un elemento del entorno.</span>';
sceneContainer.appendChild(worldInfoPanel);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.xr.enabled = true;
sceneContainer.appendChild(renderer.domElement);

const player = createPlayer(camera);
scene.add(player.vrRig);

createEnvironment(scene);
createLighting(scene);
const worldObjects = createInteractiveObjects();
scene.add(worldObjects.group);

const raycaster = createRaycaster(camera, renderer);
const desktopControls = createDesktopControls(player, camera, { container: sceneContainer });
const vrControls = createVRControls(player, renderer);
const vrControllers = createVRControllers(scene, renderer);

const xrSetup = createXRSetup(renderer);
if (xrSetup.isSupported) {
  sceneContainer.appendChild(xrSetup.button);
  xrSetup.enable();
  statusText.textContent = 'WebXR disponible. Pulsa el botón VR para entrar.';
} else {
  statusText.textContent = 'WebXR no disponible; modo escritorio activo.';
}

const loader = new GLTFLoader();
async function loadModel(url, options = {}) {
  const targetUrl = typeof url === 'string' ? url : String(url);

  if (!/\.(gltf|glb)(\?.*)?$/i.test(targetUrl)) {
    throw new Error(`Modelo inválido: "${targetUrl}". Se esperaba un archivo GLTF/GLB.`);
  }

  try {
    const model = await loader.loadAsync(targetUrl);
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (options.position) {
      model.scene.position.set(...options.position);
    }
    if (options.rotation) {
      model.scene.rotation.set(...options.rotation);
    }
    if (options.scale) {
      model.scene.scale.setScalar(options.scale);
    }

    scene.add(model.scene);
    statusText.textContent = `Modelo cargado: ${targetUrl}`;
    return model.scene;
  } catch (error) {
    const message = `No se pudo cargar el modelo "${targetUrl}". Verifica que exista y sea un GLTF/GLB válido.`;
    console.error(message, error);
    statusText.textContent = message;
    throw new Error(message);
  }
}

const modelCandidates = ['/models/example-scene.gltf'];

(async () => {
  for (const candidate of modelCandidates) {
    try {
      await loadModel(candidate, { position: [0, 0.35, 0], scale: 1.2 });
      break;
    } catch {
      // Se intenta el siguiente candidato si no existe.
    }
  }
})();

function showWorldInfo(data) {
  const title = worldInfoPanel.querySelector('strong');
  const description = worldInfoPanel.querySelector('span');

  title.textContent = data.name || 'Objeto';
  description.textContent = data.description || 'Sin descripción disponible.';
  worldInfoPanel.classList.remove('hidden');
}

function clearSelection() {
  infoPanel.hide();
  worldInfoPanel.classList.add('hidden');
  worldInfoBillboard.hide();
}

function selectObject(hitObject) {
  if (!hitObject || !hitObject.userData || hitObject.userData.type !== 'interactive') {
    return;
  }

  const data = {
    name: hitObject.userData.name || 'Objeto interactivo',
    description: hitObject.userData.description || 'Sin descripción adicional.',
  };

  infoPanel.show(data);
  showWorldInfo(data);
  worldInfoBillboard.update(data);
  worldInfoBillboard.show();
}

sceneContainer.addEventListener('click', (event) => {
  if (renderer.xr.isPresenting) {
    return;
  }

  const hits = raycaster.intersect(scene, worldObjects.interactiveObjects, event, sceneContainer);
  if (hits.length > 0) {
    selectObject(hits[0].object);
  } else {
    clearSelection();
  }
});

function handleVRSelection(controllerTarget) {
  const hits = vrControllers.getInteractions(worldObjects.interactiveObjects);
  const activeHit = hits.find((hit) => hit.controller === controllerTarget);
  if (activeHit && activeHit.result.object) {
    selectObject(activeHit.result.object);
  }
}

renderer.xr.addEventListener('sessionstart', () => {
  statusText.textContent = 'Sesión WebXR iniciada. El entorno responde con mandos.';
  infoPanel.show({
    name: 'Modo VR',
    description: 'Los mandos del visor pueden apuntar y seleccionar objetos del entorno.',
  });
});

renderer.xr.addEventListener('sessionend', () => {
  statusText.textContent = 'VR finalizada. Se ha restaurado el control de escritorio.';
});

const xrControllerLeft = renderer.xr.getController(0);
const xrControllerRight = renderer.xr.getController(1);

[xrControllerLeft, xrControllerRight].forEach((controller) => {
  controller.addEventListener('selectstart', () => {
    handleVRSelection(controller);
  });
});

scene.add(xrControllerLeft, xrControllerRight);

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

const clock = new THREE.Clock();

function animate() {
  const delta = Math.min(clock.getDelta(), 0.033);

  if (!renderer.xr.isPresenting) {
    desktopControls.update(delta);
    syncPlayerCamera(player);
  } else {
    vrControls.update(delta);
  }

  vrControllers.syncToRenderer();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
loadingMessage.textContent = 'Experiencia VR lista.';
