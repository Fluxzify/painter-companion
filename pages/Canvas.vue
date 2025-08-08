<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Powers } from '~/enums/powers'

import InteractiveCanvas from '~/components/InteractiveCanvas.vue';
import CompanionRefactor from '~/components/Companion.vue';

const selectedPower = ref<Powers | null>(null)
const currentPower = ref<Powers>(Powers.Ice)

watch(selectedPower, (newVal: Powers | null) => {
  if (newVal !== null) {
    currentPower.value = newVal
  }
})

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
      <InteractiveCanvas ref="interactiveCanvasInstanceRef" @update:selectedPower="selectedPower = $event" />
    </div>
    
    <div class="companion-wrapper">
      <CompanionRefactor :canvas="canvasValue" :power="currentPower" />
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
