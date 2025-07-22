<template>
  <div
    class="absolute z-10 pointer-events-none"
    :style="{
      width: `${containerSize}px`,
      height: `${containerSize}px`,
    }"
  >
    <div
      class="relative"
      :style="{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
      }"
    >
      <!-- Personaje -->
      <img
        :src="companionImg"
        alt="Companion"
        class="absolute top-0 left-0"
        :style="{
          width: `${characterSize}px`,
          height: `${characterSize}px`,
          userSelect: 'none',
          pointerEvents: 'none',
        }"
      />

      <!-- Brazo -->
      <img
        :src="armImg"
        alt="Brazo"
        class="absolute"
        :style="{
          width: `${armSize}px`,
          height: `${armSize}px`,
          top: `${(containerSize - armSize) / 2}px`,
          left: `${(containerSize - armSize) / 2}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'center center',
          userSelect: 'none',
          pointerEvents: 'none',
        }"
      />

      <!-- Arma -->
      <img
        :src="weaponImg"
        alt="Arma"
        class="absolute"
        :style="{
          width: `${weaponSize}px`,
          height: `${weaponSize}px`,
          top: `${(containerSize - weaponSize) / 2}px`,
          left: `${(containerSize - weaponSize) / 2}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'center center',
          userSelect: 'none',
          pointerEvents: 'none',
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import companionImg from '@/assets/Companion/Sprites/Companion/Wizard Base.png'
import armImg from '@/assets/Companion/Sprites/Arm/Arm Base.png'
import weaponImg from '@/assets/Companion/Sprites/Weapon/Ice Staff.png'

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

// Tamaños originales
const originalCharacterSize = 1134
const originalArmSize = 320
const originalWeaponSize = 1200

// Escalado a la mitad
const characterSize = originalCharacterSize / 3
const armSize = originalArmSize / 3
const weaponSize = originalWeaponSize / 3

// Tamaño contenedor para que contenga el mayor elemento (arma escalada)
const containerSize = Math.max(characterSize, armSize, weaponSize)

function lerpAngle(a, b, t) {
  let diff = b - a
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return a + diff * t
}

function updateArmAngle() {
  if (props.gameAreaWidth === 0 || props.gameAreaHeight === 0) {
    requestAnimationFrame(updateArmAngle)
    return
  }

  const companionCenterX = props.gameAreaWidth / 2
  const companionCenterY = props.gameAreaHeight - characterSize / 2

  const dx = props.mousePos.x - companionCenterX
  const dy = props.mousePos.y - companionCenterY

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
        y: props.gameAreaHeight - characterSize / 2
      },
      angle: angle.value
    }
  })
  window.dispatchEvent(customEvent)
}

onMounted(() => {
  prevMouse.value = { ...props.mousePos }
  window.addEventListener('click', handleClick)
  updateArmAngle()
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})
</script>

<style scoped>
img {
  user-select: none;
  pointer-events: none;
}
</style>
