<template>
  <div class="relative bg-gray-900 w-full h-full rounded-lg overflow-hidden game-area-container">
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas> 
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const canvasRef = ref(null)
let ctx = null
let resizeObserver = null

const mouseX = ref(0)
const mouseY = ref(0)

// Declara drawImage como una ref de Vue para que su estado sea reactivo
const drawImage = ref(null); 

// Importa la imagen de hielo directamente. Nuxt/Vite se encarga de la ruta final.
import hieloImageSrc from '~/assets/Canva/hielo.png';

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) {
    console.warn('resizeCanvas: canvasRef.value es null. Retornando.')
    return
  }

  const newWidth = canvas.clientWidth
  const newHeight = canvas.clientHeight

  if (Math.round(canvas.width) !== Math.round(newWidth) || Math.round(canvas.height) !== Math.round(newHeight)) {
    canvas.width = newWidth
    canvas.height = newHeight
    console.log(`Canvas redimensionado a: ${newWidth}x${newHeight}`)
    // Restaura estilos si se pierden en el redimensionamiento (ej. lineWidth)
    if (ctx) {
      ctx.strokeStyle = 'rgba(0,255,255,0.7)'
      ctx.lineWidth = 5
    }
  }
}

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

const debouncedResizeCanvas = debounce(resizeCanvas, 100);

function handleMouseMove(event) {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  mouseX.value = event.clientX - rect.left
  mouseY.value = event.clientY - rect.top
}

function handleCanvasClick(event) {
  const canvas = canvasRef.value;
  // Verifica si ctx existe y si la imagen está cargada
  if (!canvas || !ctx) {
    console.warn('handleCanvasClick: canvas o ctx no están listos.');
    return;
  }
  if (!drawImage.value || !drawImage.value.complete) {
    console.warn('handleCanvasClick: La imagen no ha sido cargada completamente o no existe.');
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const imgWidth = 50; 
  const imgHeight = 50;
  
  // Dibuja la imagen
  ctx.drawImage(drawImage.value, clickX - imgWidth / 2, clickY - imgHeight / 2, imgWidth, imgHeight);
  console.log(`Dibujando imagen en: X=${clickX}, Y=${clickY}`);
}

function drawPower(from, angle) {
  if (!ctx) {
    console.warn('drawPower: ctx es null, no se puede dibujar el poder.')
    return
  }

  const length = 100
  const angleRad = angle * Math.PI / 180; 
  const toX = from.x + length * Math.cos(angleRad)
  const toY = from.y + length * Math.sin(angleRad)

  ctx.strokeStyle = 'rgba(0,255,255,0.7)'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(toX, toY)
  ctx.stroke()
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) {
    requestAnimationFrame(draw);
    return;
  }

  // Mantén el clearRect para que no se superpongan los dibujos en cada frame
  // Si quieres que los dibujos permanezcan, necesitas una lógica para gestionarlos.
  // Por ahora, solo se dibujará la línea de poder y el punto del mouse si el Companion lo activa.
  // La imagen de clic se dibuja directamente en handleCanvasClick y se mantiene.
  // Si quieres que el canvas se limpie y redibuje todo (incluidas las imágenes),
  // necesitas almacenar las posiciones y tipos de todas las imágenes dibujadas.
  // Dejaremos clearRect para que el "disparo" desaparezca, pero la imagen de clic se mantendrá.
  // Si la imagen desaparece, es porque `clearRect` la está borrando en cada frame.
  // Para que las imágenes persistan, elimina `ctx.clearRect(0, 0, canvas.width, canvas.height);` de aquí
  // o redibuja todas las imágenes guardadas en cada frame.
  // Para empezar, vamos a **quitar clearRect de aquí** para que las imágenes persistan
  // y solo se limpie el canvas cuando sea necesario (e.g., al redimensionar).
  // Si se requiere un "juego" con elementos dinámicos que se mueven,
  // la lógica de `draw` necesitará una lista de objetos a renderizar.

  requestAnimationFrame(draw);
}

onMounted(async () => {
  await nextTick();

  const canvas = canvasRef.value
  if (!canvas) {
    console.error('onMounted: El elemento canvas no se encontró después de nextTick. No se puede inicializar.')
    return
  }

  ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('onMounted: No se pudo obtener el contexto 2D del canvas.')
    return
  }

  debouncedResizeCanvas()

  const parentContainer = canvas.parentElement;
  if (parentContainer) {
    resizeObserver = new ResizeObserver(() => {
      debouncedResizeCanvas();
    });
    resizeObserver.observe(parentContainer);
  } else {
    console.error('onMounted: No se encontró el elemento padre del canvas para el ResizeObserver.');
  }

  parentContainer.addEventListener('mousemove', handleMouseMove)
  
  // Listener para el clic del mouse en el canvas para dibujar la imagen
  canvas.addEventListener('click', handleCanvasClick); 

  // Listener para el evento de disparo del Companion (dibujar línea de poder)
  window.addEventListener('draw-power-on-canvas', (event) => {
    const { from, angle } = event.detail
    drawPower(from, angle)
  })

  // Inicializa el objeto Image DENTRO de onMounted
  drawImage.value = new Image();
  drawImage.value.src = hieloImageSrc; 

  drawImage.value.onload = () => {
    console.log('Imagen de dibujo cargada exitosamente.');
    // Si la imagen se carga después de que draw() ya haya iniciado,
    // esto asegura que drawImage.value esté disponible.
  };
  drawImage.value.onerror = () => {
    console.error('Error al cargar la imagen de dibujo. Verifica la ruta:', hieloImageSrc);
  };

  // Inicia el bucle de dibujo. Si la imagen ya se cargó, la lógica de clic funcionará.
  // Si no, esperará a onload.
  draw(); 
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  const parentContainer = canvasRef.value ? canvasRef.value.parentElement : null;
  if (parentContainer) {
    parentContainer.removeEventListener('mousemove', handleMouseMove)
  }
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('click', handleCanvasClick);
  }

  window.removeEventListener('draw-power-on-canvas', (event) => {
    const { from, angle } = event.detail
    drawPower(from, angle)
  })
})
</script>

<style scoped>
.game-area-container {
  border: 4px solid #00FFFF;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: default; 
}

.game-area-container:hover {
  cursor: default;
}

canvas {
  cursor: none; 
}

canvas:hover {
  /* Asegúrate que esta ruta también esté correcta después del build de Nuxt */
  cursor: url('/_nuxt/assets/Canva/mira.png') 16 16, auto;
}
</style>