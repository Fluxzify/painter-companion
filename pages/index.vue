<template>
  <div class="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center">

    <!-- Título -->
    <div class="w-full p-4 z-10 text-white text-center">
      <h1 class="text-3xl font-bold">Compañero Interactivo</h1>
    </div>

    <!-- Contenedor para el canvas centrado con márgenes laterales -->
    <div
      ref="gameAreaDivRef"
      :style="{ width: gameAreaWidth + 'px', height: gameAreaHeight + 'px' }"
      class="relative overflow-hidden border-4 border-purple-500 mx-auto max-w-[90%] md:max-w-[800px] w-full"
    >
      <InteractiveCanvas class="w-full h-full" />
    </div>  

    <!-- Div separador -->
    <div class="h-8"></div> <!-- Ajusta aquí la separación vertical -->

    <!-- Contenedor del Companion, centrado también -->
    <div class="relative flex-grow-0 h-[120px] w-full flex justify-center">
      <Companion 
        class="z-20"
        :mouse-pos="relativeMousePos"
        :game-area-width="gameAreaDims.width"
        :game-area-height="gameAreaDims.height"
      />
    </div>

    <!-- Otro contenido (opcional) -->
    <div class="mt-4 text-white">
      <!-- Footer o botones futuros -->
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