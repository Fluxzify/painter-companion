<template>
  <div
    class="absolute z-10 pointer-events-none"
    style="width: 80px; height: 80px;" 
    >
    <div class="relative w-[80px] h-[80px]">
      <img
        :src="companionImg"
        alt="Companion"
        class="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
      />

      <img
        :src="armImg"
        alt="Brazo"
        class="absolute w-[80px] h-[16px] object-contain"
        :style="{
          top: '50%',
          left: '50%',
          transform: `translate(-40px, -8px) rotate(${angle}deg)`,
          transformOrigin: '0% 50%',
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import companionImg from '@/assets/Companion/companion.png'
import armImg from '@/assets/Companion/arm.png'

const props = defineProps({
  mousePos: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  gameAreaWidth: {
    type: Number,
    default: 0
  },
  gameAreaHeight: {
    type: Number,
    default: 0
  }
})

const prevMouse = ref({ x: 0, y: 0 })
const movementThreshold = 0.5

const angle = ref(0)

function lerpAngle(a, b, t) {
  let diff = b - a
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return a + diff * t
}

function updateArmAngle() {
  if (props.gameAreaWidth === 0 || props.gameAreaHeight === 0) {
    requestAnimationFrame(updateArmAngle);
    return;
  }

  // Las coordenadas del centro del Companion en el área de juego
  // Si está abajo al centro, su X es gameAreaWidth / 2
  // Y su Y es gameAreaHeight - (altura_companion / 2)
  const companionCenterX = props.gameAreaWidth / 2;
  const companionCenterY = props.gameAreaHeight - 40; // 40 es la mitad de la altura del companion (80px)

  const dx = props.mousePos.x - companionCenterX;
  const dy = props.mousePos.y - companionCenterY;

  const deltaX = Math.abs(props.mousePos.x - prevMouse.value.x)
  const deltaY = Math.abs(props.mousePos.y - prevMouse.value.y)

  if (deltaX > movementThreshold || deltaY > movementThreshold) {
    const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI)
    angle.value = lerpAngle(angle.value, targetAngle, 0.1)

    prevMouse.value.x = props.mousePos.x
    prevMouse.value.y = props.mousePos.y
  }

  requestAnimationFrame(updateArmAngle)
}

function handleClick() {
  const customEvent = new CustomEvent('companion-fire', {
    detail: {
      from: {
        x: props.gameAreaWidth / 2,
        y: props.gameAreaHeight - 40 // Punto de origen del disparo es el centro inferior del Companion
      },
      angle: angle.value
    }
  })
  window.dispatchEvent(customEvent)
}

onMounted(() => {
  prevMouse.value = { ...props.mousePos };
  window.addEventListener('click', handleClick)
  updateArmAngle()
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})

watch(() => props.mousePos, () => {
  // Reaccionar a cambios de mousePos si es necesario
});
</script>

<style scoped>
img {
  user-select: none;
  pointer-events: none;
}
</style>