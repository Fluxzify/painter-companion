<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, reactive } from 'vue'
import { useArmSkins } from '@/composables/companion/useArmSkins'
import { useBodySkins } from '@/composables/companion/useBodySkins'
import { useWeaponSkins } from '@/composables/companion/useWeaponSkins'
import { useArm } from '@/composables/companion/useArm'
import { useBody } from '@/composables/companion/useBody'
import { useWeapon } from '@/composables/companion/useWeapon'
import { useRotation } from '~/composables/companion/useRotation'
import { useMousePosCanva } from '~/composables/canvas/useMousePosCanva'

const bodySkin = ref('wizard')
const armSkin = ref('wizard')
const weaponSkin = ref('iceStaff')
const { armSkinUrl } = useArmSkins(armSkin)
const { bodySkinUrl } = useBodySkins(bodySkin)
const { weaponSkinUrl } = useWeaponSkins(weaponSkin)

const props = defineProps<{ canvas: HTMLCanvasElement | null }>();
const canvasWidth = ref(700)
const canvasHeight = ref(700)
const mousePosition = reactive({ x: 0, y: 0 })

let updateMouse: ((event: MouseEvent) => void) | null = null

const loadedArmImg = ref<HTMLImageElement | null>(null)
const loadedBodyImg = ref<HTMLImageElement | null>(null)
const loadedWeaponImg = ref<HTMLImageElement | null>(null)

const canvasCompanionRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

let arm: ReturnType<typeof useArm> | null = null
let body: ReturnType<typeof useBody> | null = null
let weapon: ReturnType<typeof useWeapon> | null = null

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function initializeCharacter() {
  const centerX = canvasWidth.value / 2
  const centerY = canvasHeight.value / 2

  const rotation = useRotation({ x: centerX, y: centerY }, mousePosition)

  arm = useArm(centerX / 2, centerY, rotation.angle.value)
  body = useBody(centerX, centerY)
  weapon = useWeapon(centerX / 3, centerY, rotation.angle.value)
}

function renderLoop() {
  if (!ctx || !arm || !body || !weapon) return

  const origin = {
    x: canvasWidth.value / 2,
    y: canvasHeight.value / 2,
  }

  const rotation = useRotation(origin, mousePosition)
  arm.rotation.value = rotation.angle.value
  weapon.rotation.value = rotation.angle.value

  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  arm.draw(ctx, loadedArmImg.value, canvasWidth.value / 3, canvasHeight.value / 3)
  weapon.draw(ctx, loadedWeaponImg.value, canvasWidth.value, canvasHeight.value)
  body.draw(ctx, loadedBodyImg.value, canvasWidth.value, canvasHeight.value)

  requestAnimationFrame(renderLoop)
}

onMounted(async () => {
  const canvas = canvasCompanionRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  if (!ctx) return

  canvasWidth.value = canvas.width
  canvasHeight.value = canvas.height

  loadedArmImg.value = await loadImage(armSkinUrl.value)
  loadedBodyImg.value = await loadImage(bodySkinUrl.value)
  loadedWeaponImg.value = await loadImage(weaponSkinUrl.value)

  initializeCharacter()
  renderLoop()
})

watch(
  () => props.canvas,
  (newCanvasElement, oldCanvasElement) => {
    if (oldCanvasElement && updateMouse) {
      oldCanvasElement.removeEventListener('mousemove', updateMouse)
    }

    if (newCanvasElement) {
      const result = useMousePosCanva(newCanvasElement, mousePosition)
      updateMouse = result.updateMouse

      newCanvasElement.addEventListener('mousemove', (e) => {
        if (updateMouse) {
          updateMouse(e)
        }
      })
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (props.canvas && updateMouse) {
    props.canvas.removeEventListener('mousemove', updateMouse)
  }
})
</script>

<template>
  <canvas
    ref="canvasCompanionRef"
    :width="canvasWidth"
    :height="canvasHeight"
    :style="{ top: '109px', left: '0px' }"
  />
</template>

<style scoped>
canvas {
  border: 1px solid #740f0f;
}
</style>
