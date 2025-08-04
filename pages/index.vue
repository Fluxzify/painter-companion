<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import type { Ref } from 'vue';

import InteractiveCanvas from '~/components/InteractiveCanvas.vue';
import CompanionRefactor from '~/components/Companion.vue';
import CanvasForm from '~/components/CanvasForm.vue'; 

// Ref al componente hijo InteractiveCanvas
const interactiveCanvasInstanceRef = ref<InstanceType<typeof InteractiveCanvas> | null>(null);

// Computamos el canvas real expuesto desde el hijo
const canvasValue = computed(() => {
  return interactiveCanvasInstanceRef.value?.canvasRef ?? null;
});
</script>

<template>
  <div class="parent-wrapper">
    <div class="canvas-wrapper">
      <InteractiveCanvas ref="interactiveCanvasInstanceRef" />
    </div>
    
    <div class="companion-wrapper">
      <CompanionRefactor :canvas="canvasValue" />
    </div>
  </div>
</template>

<style scoped>
.parent-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 1rem;
  gap: 1rem;
}

/* En pantallas grandes (>= 768px), lado a lado */
@media (min-width: 768px) {
  .parent-wrapper {
    flex-direction: row;
    align-items: flex-end;
  }

  .canvas-wrapper,
  .companion-wrapper {
    flex: 1;
  }

  .canvas-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .companion-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
