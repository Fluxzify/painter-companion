<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArmSkins } from '@/composables/companion/useArmSkins'
import { useBodySkins } from '@/composables/companion/useBodySkins'
import { useWeaponSkins } from '@/composables/companion/useWeaponSkins'
import { useArm } from '@/composables/companion/useArm'
import { useBody } from '@/composables/companion/useBody'
import { useWeapon } from '@/composables/companion/useWeapon'
import { useMousePosition } from '~/composables/companion/useMousePosAll'
import { useRotation } from '~/composables/companion/useRotation'

// Refs de skins elegidos
const bodySkin = ref('wizard')
const armSkin = ref('wizard')
const weaponSkin = ref('iceStaff')
const { armSkinUrl } = useArmSkins(armSkin)
const { bodySkinUrl } = useBodySkins(bodySkin)
const { weaponSkinUrl } = useWeaponSkins(weaponSkin)
const mousePos = useMousePosition()

const canvasWidth = ref(0)
const canvasHeight = ref(0)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

let arm: ReturnType<typeof useArm> | null = null
let body: ReturnType<typeof useBody> | null = null
let weapon: ReturnType<typeof useWeapon> | null = null
// Referencia al canvas y contexto

function initializeCharacter() {
  const centerX = canvasWidth.value / 2
  const centerY = canvasHeight.value / 2
  const origin: { x: number; y: number } = { x: centerX, y: centerY }

  const target = {
    x: mousePos.x.value,
    y: mousePos.y.value
  }


  const rotation = useRotation(origin, target)

  arm = useArm(centerX / 2, centerY, rotation.angle.value)
  body = useBody(centerX, centerY)
  weapon = useWeapon(centerX / 3, centerY, rotation.angle.value)
  
}


function renderLoop() {
  if (!ctx || !arm || !body || !weapon) return

  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

 
  arm.draw(ctx, canvasWidth.value/ 3, canvasHeight.value/ 3, armSkinUrl.value)
  weapon.draw(ctx, canvasWidth.value, canvasHeight.value, weaponSkinUrl.value)
   body.draw(ctx, canvasWidth.value, canvasHeight.value, bodySkinUrl.value)

  requestAnimationFrame(renderLoop)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  if (!ctx) return

  canvasWidth.value = canvas.width
  canvasHeight.value = canvas.height
  initializeCharacter()

  renderLoop()
})

watch(
  () => ({ x: mousePos.x.value, y: mousePos.y.value }),
  (newTarget) => {
    if (!canvasWidth.value || !canvasHeight.value) return

    const origin = { x: canvasWidth.value / 2, y: canvasHeight.value / 2 }
    const rotation = useRotation(origin, newTarget)

    if (arm) arm.rotation.value = rotation.angle.value
    if (weapon) weapon.rotation.value = rotation.angle.value
  }
)
</script>

<template>
  <canvas ref="canvasRef" width="800" height="800" :style="{ position: 'absolute' }" />

</template>

<style scoped>
canvas {
  border: 1px solid #740f0f;
}
</style>