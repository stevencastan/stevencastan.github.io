import * as THREE from 'three';

export function createInformationPanel() {
  const panel = document.createElement('aside');
  panel.className = 'info-panel hidden';
  panel.setAttribute('aria-live', 'polite');

  const title = document.createElement('h2');
  title.className = 'info-panel__title';
  panel.appendChild(title);

  const body = document.createElement('p');
  body.className = 'info-panel__body';
  panel.appendChild(body);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'info-panel__close';
  closeButton.setAttribute('aria-label', 'Cerrar información');
  closeButton.textContent = 'Cerrar';
  panel.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
    panel.classList.add('hidden');
  });

  document.body.appendChild(panel);

  function show(objectData) {
    if (!objectData) {
      return;
    }

    title.textContent = objectData.name || 'Información';
    body.textContent = objectData.description || 'Sin descripción disponible.';
    panel.classList.remove('hidden');
  }

  function hide() {
    panel.classList.add('hidden');
  }

  return {
    element: panel,
    show,
    hide,
  };
}

export function createWorldInfoBillboard() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), material);
  mesh.position.set(0, 1.9, -4.8);
  mesh.lookAt(0, 1.7, 0);
  mesh.userData = { type: 'world-info-panel' };

  function update(data = {}) {
    const title = data.name || 'Información';
    const body = data.description || 'Sin descripción disponible.';

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(7, 12, 20, 0.9)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(126, 216, 255, 0.9)';
    context.lineWidth = 8;
    context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    context.fillStyle = '#f5faff';
    context.font = '700 54px sans-serif';
    context.fillText(title, 60, 120, canvas.width - 120);

    context.fillStyle = '#dfeaff';
    context.font = '400 30px sans-serif';
    const lines = wrapText(context, body, canvas.width - 120);
    lines.forEach((line, index) => {
      context.fillText(line, 60, 180 + index * 40, canvas.width - 120);
    });

    texture.needsUpdate = true;
  }

  return {
    mesh,
    update,
    hide() {
      mesh.visible = false;
    },
    show() {
      mesh.visible = true;
    },
  };
}

function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}
