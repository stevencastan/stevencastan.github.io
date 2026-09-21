# Proyecto VR Web

Aplicación 3D independiente en JavaScript ES Modules con Vite y Three.js, sin React. Incluye escena 3D, controles de escritorio, WebXR, raycasting, panel informativo y carga de modelos GLTF/GLB.

## Requisitos

- Node.js 18 o superior
- Navegador moderno con soporte WebGL
- Para WebXR real: visor compatible con WebXR (Quest, etc.) y navegador compatible

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev -- --host
```

Abre la URL local que muestre Vite en el navegador.

## Build de producción

```bash
npm run build
```

Vista previa local:

```bash
npm run preview -- --host
```

## Controles

### Escritorio

- WASD o flechas: movimiento
- Ratón: mirar alrededor
- Click: seleccionar objetos interactivos
- P: activar/desactivar pointer lock

### VR

- Botón de VR en la interfaz si el navegador lo soporta
- Mandos izquierdo/derecho: apuntado y selección
- Panel informativo dentro del mundo y desktop simultáneo

## Estructura principal

- src/main.js: arranque principal y composición de la escena
- src/scene/: escena, iluminación y entorno
- src/player/: cámara, movimiento desktop y preparación VR
- src/interaction/: raycasting, objetos y panel informativo
- src/vr/: WebXR y controladores VR

## Modelos 3D

La carga de modelos usa GLTFLoader con validación explícita. Si el archivo no existe o no es un GLTF/GLB válido, la app muestra un error claro y continúa funcionando con la escena base.

El proyecto incluye un modelo mínimo de prueba listo para cargar:

- [public/models/example-scene.gltf](./public/models/example-scene.gltf)

Para probar otro modelo, copia un archivo `.gltf` o `.glb` a `public/models/` y actualiza la lista `modelCandidates` de [src/main.js](./src/main.js). Los archivos GLTF que usan recursos externos también deben mantener sus texturas y buffers relativos dentro de `public/`.

## Limitaciones

- La locomoción VR avanzada (joystick/teletransporte) queda preparada para ampliación futura, pero no se implementa en esta versión.
- El soporte WebXR real depende del navegador, del sistema operativo y del hardware del dispositivo.
- El entorno funciona en escritorio con fallback seguro cuando WebXR no esté disponible.
- La carga de modelos GLTF/GLB depende de que el archivo exista en la ruta pública del proyecto.
# stevencastan.github.io
