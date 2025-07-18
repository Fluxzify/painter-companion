<template>
  <div class="relative w-full h-screen bg-black overflow-hidden flex flex-col">
    <div class="w-full p-4 z-10 text-white">
      <h1 class="text-3xl font-bold">Compañero Interactivo</h1>
    </div>

    <div ref="gameAreaDivRef" class="flex-grow relative overflow-hidden">
      <InteractiveCanvas class="w-full h-full" /> 

      <Companion 
        class="absolute z-20 bottom-0 left-1/2 -translate-x-1/2" 
        :mouse-pos="relativeMousePos"
        :game-area-width="gameAreaDims.width"
        :game-area-height="gameAreaDims.height"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import InteractiveCanvas from '~/components/InteractiveCanvas.vue'
import Companion from '~/components/Companion.vue' 

const relativeMousePos = ref({ x: 0, y: 0 })
const gameAreaDims = ref({ width: 0, height: 0 })
const gameAreaDivRef = ref(null)

let resizeObserverInstance = null;

function updateRelativeMousePos(event) {
  const gameAreaContainer = gameAreaDivRef.value;
  if (!gameAreaContainer) return;

  const rect = gameAreaContainer.getBoundingClientRect();
  relativeMousePos.value.x = event.clientX - rect.left;
  relativeMousePos.value.y = event.clientY - rect.top;
}

function updateGameAreaDims() {
  if (gameAreaDivRef.value) {
    gameAreaDims.value.width = gameAreaDivRef.value.clientWidth;
    gameAreaDims.value.height = gameAreaDivRef.value.clientHeight;
  }
}

function handleDrawPowerOnCanvas(event) {
  // Manejar el evento de dibujo de poder si es necesario,
  // InteractiveCanvas debe escuchar este evento directamente.
}

onMounted(() => {
  resizeObserverInstance = new ResizeObserver(() => {
    updateGameAreaDims();
  });

  if (gameAreaDivRef.value) {
    resizeObserverInstance.observe(gameAreaDivRef.value);
    updateGameAreaDims();
    gameAreaDivRef.value.addEventListener('mousemove', updateRelativeMousePos);
  }

  window.addEventListener('draw-power-on-canvas', handleDrawPowerOnCanvas);
})

onBeforeUnmount(() => {
  if (resizeObserverInstance) {
    resizeObserverInstance.disconnect();
  }
  if (gameAreaDivRef.value) {
    gameAreaDivRef.value.removeEventListener('mousemove', updateRelativeMousePos);
  }
  window.removeEventListener('draw-power-on-canvas', handleDrawPowerOnCanvas);
})
</script>

<style scoped>
/* No se requieren estilos CSS adicionales aquí */
</style>